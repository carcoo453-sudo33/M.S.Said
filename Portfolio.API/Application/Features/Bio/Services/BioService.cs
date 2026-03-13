using Portfolio.API.Entities;
using Portfolio.API.Repositories;
using Portfolio.API.Application.Features.Bio.DTOs;
using Portfolio.API.Application.Features.Bio.Mappers;
using Portfolio.API.Domain.Enums;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using BioEntity = Portfolio.API.Entities.Bio;

namespace Portfolio.API.Application.Features.Bio.Services;

public class BioService : IBioService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IConfiguration _configuration;
    private readonly HttpClient _httpClient;
    private readonly IMemoryCache _cache;
    private readonly ILogger<BioService> _logger;

    /// <summary>
    /// Initializes a new instance of the <see cref="BioService"/> class with its required dependencies.
    /// </summary>
    public BioService(IUnitOfWork unitOfWork, IConfiguration configuration, HttpClient httpClient, IMemoryCache cache, ILogger<BioService> logger)
    {
        _unitOfWork = unitOfWork;
        _configuration = configuration;
        _httpClient = httpClient;
        _cache = cache;
        _logger = logger;
    }

    /// <summary>
    /// Retrieves the primary bio with eager-loaded related entities, updates runtime statistics, and returns the mapped DTO.
    /// </summary>
    /// <param name="cancellationToken">Token to cancel the operation.</param>
    /// <returns>The mapped <see cref="BioDto"/> for the first bio found, or <c>null</c> if no bio exists.</returns>
    public async Task<BioDto?> GetBioAsync(CancellationToken cancellationToken = default)
    {
        // Single query with eager loading of related entities
        var bio = await _unitOfWork.Repository<BioEntity>()
            .Query()
            .AsNoTracking()
            .Include(b => b.Signature)
            .Include(b => b.TechnicalFocus)
            .FirstOrDefaultAsync(cancellationToken);
            
        if (bio == null) return null;

        // Calculate dynamic statistics sequentially to avoid DbContext concurrency issues
        bio.YearsOfExperience = await CalculateYearsOfExperienceAsync(bio.CareerStartDate);
        bio.ProjectsCompleted = await GetProjectsCompletedCountAsync();
        bio.CodeCommits = await GetGitHubCommitsAsync(bio.GitHubUsername);

        System.Diagnostics.Debug.WriteLine($"📊 Bio Statistics - Years: {bio.YearsOfExperience}, Projects: {bio.ProjectsCompleted}, Commits: {bio.CodeCommits}");

        return BioMapper.ToDto(bio);
    }

    /// <summary>
    /// Creates or updates the site's bio using the provided data and returns the updated DTO.
    /// </summary>
    /// <param name="id">Identifier to assign when creating a new bio if none exists.</param>
    /// <param name="dto">Data to apply to the bio.</param>
    /// <param name="cancellationToken">Token to observe while performing the operation.</param>
    /// <returns>The updated <see cref="BioDto"/> reflecting persisted changes and recalculated dynamic fields (years of experience, projects completed, code commits).</returns>
    public async Task<BioDto> UpdateBioAsync(Guid id, BioDto dto, CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("UpdateBioAsync called with ID: {Id}", id);
            
            var repository = _unitOfWork.Repository<BioEntity>();
            
            // Single query with eager loading of related entities
            var bio = await repository.Query()
                .AsTracking()
                .Include(b => b.Signature)
                .Include(b => b.TechnicalFocus)
                .FirstOrDefaultAsync(cancellationToken);

            bool isNew = bio == null;
            _logger.LogInformation("Bio found: {IsNew}, TechnicalFocus loaded: {TFLoaded}, Signature loaded: {SigLoaded}",
                !isNew,
                bio?.TechnicalFocus != null,
                bio?.Signature != null);

            if (bio == null)
            {
                bio = new BioEntity { Id = id };
            }

            BioMapper.UpdateEntity(bio, dto);
            _logger.LogInformation("After mapping - TechnicalFocus: {TF}, Signature: {Sig}",
                bio.TechnicalFocus != null,
                bio.Signature != null);
            
            // Add new bio or update existing
            if (isNew)
            {
                await repository.AddAsync(bio);
            }
            // If it's an existing bio, it is already being tracked by AsTracking(), 
            // so EF Core's ChangeTracker will automatically detect added/modified properties.
            // Calling repository.Update(bio) explicitly would force newly created child entities 
            // (like TechnicalFocus) into a Modified state, causing DbUpdateConcurrencyException.

            
            // Save changes to database
            var saveResult = await _unitOfWork.CompleteAsync(cancellationToken);
            _logger.LogInformation("Bio saved successfully. Changes: {Changes}", saveResult);

            // Recalculate dynamic statistics sequentially after update
            bio.YearsOfExperience = await CalculateYearsOfExperienceAsync(bio.CareerStartDate);
            bio.ProjectsCompleted = await GetProjectsCompletedCountAsync();
            bio.CodeCommits = await GetGitHubCommitsAsync(bio.GitHubUsername);

            return BioMapper.ToDto(bio);
        }
        catch (Exception ex)
        {
            System.IO.File.WriteAllText("backend_error.txt", ex.ToString());
            _logger.LogError(ex, "UpdateBioAsync failed completely");
            throw;
        }
    }

    /// <summary>
    /// Calculate the number of full years since the specified career start date or earliest experience entry.
    /// </summary>
    private async Task<string> CalculateYearsOfExperienceAsync(DateTime careerStartDate)
    {
        var cacheKey = $"YearsOfExperience_{careerStartDate:yyyyMMdd}";
        if (_cache.TryGetValue(cacheKey, out string? cachedYears) && cachedYears != null)
        {
            return cachedYears;
        }

        var referenceDate = careerStartDate;
        
        // If CareerStartDate is the default (2021-01-01) or uninitialized, try to find the earliest experience
        var defaultDate = new DateTime(2021, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        if (careerStartDate <= defaultDate)
        {
            var earliestDurations = await _unitOfWork.Repository<Experience>()
                .Query()
                .AsNoTracking()
                .Select(e => e.Duration)
                .ToListAsync();

            if (earliestDurations.Any())
            {
                // Try to extract the minimum year from all durations
                var years = earliestDurations
                    .Select(d => ExtractYear(d))
                    .Where(y => y > 0)
                    .ToList();

                if (years.Any())
                {
                    referenceDate = new DateTime(years.Min(), 1, 1, 0, 0, 0, DateTimeKind.Utc);
                }
            }
        }

        var experienceYears = DateTime.UtcNow.Year - referenceDate.Year;
        if (DateTime.UtcNow.Month < referenceDate.Month ||
            (DateTime.UtcNow.Month == referenceDate.Month && DateTime.UtcNow.Day < referenceDate.Day))
        {
            experienceYears--;
        }
        
        var result = $"{Math.Max(experienceYears, 0)}+";
        
        _cache.Set(cacheKey, result, new MemoryCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(12)
        });

        return result;
    }

    private static int ExtractYear(string duration)
    {
        if (string.IsNullOrEmpty(duration)) return 0;
        var parts = duration.Split(new[] { '-', '/', ' ' }, StringSplitOptions.RemoveEmptyEntries);
        foreach (var part in parts)
        {
            if (int.TryParse(part.Trim(), out int year) && year >= 2000 && year <= 2100)
                return year;
        }
        return 0;
    }

    /// <summary>
    /// Retrieve the number of completed projects, falling back to GitHub repository count if local data is sparse.
    /// </summary>
    private async Task<string> GetProjectsCompletedCountAsync()
    {
        var cacheKey = "ProjectsCompletedCount";
        if (_cache.TryGetValue(cacheKey, out string? cachedCount) && cachedCount != null)
        {
            return cachedCount;
        }

        try
        {
            var query = _unitOfWork.Repository<Project>().Query().AsNoTracking();
            var completedCount = await query.CountAsync(p => p.Status == ProjectStatus.Completed);
            
            // If zero completed, count InProgress too
            var totalCount = completedCount;
            if (totalCount == 0)
            {
                totalCount = await query.CountAsync(p => p.Status == ProjectStatus.Completed || p.Status == ProjectStatus.InProgress);
            }

            // Fallback/Enhancement: If local projects are few, try to fetch GitHub repo count if a username is available
            if (totalCount < 5)
            {
                var bio = await _unitOfWork.Repository<BioEntity>().Query().AsNoTracking().FirstOrDefaultAsync();
                if (bio != null && !string.IsNullOrEmpty(bio.GitHubUsername))
                {
                    var gitHubToken = _configuration["GitHub:Token"];
                    var repoCountStr = await GetGitHubRepoCountAsync(bio.GitHubUsername, gitHubToken);
                    if (int.TryParse(repoCountStr, out int repoCount) && repoCount > totalCount)
                    {
                        // Use the higher of the two to ensure a representative count
                        totalCount = repoCount;
                    }
                }
            }
            
            var result = totalCount.ToString();
            
            _cache.Set(cacheKey, result, new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1)
            });

            return result;
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"❌ Error in GetProjectsCompletedCountAsync: {ex.Message}");
            return "0";
        }
    }

    /// <summary>
    /// Retrieves a GitHub user's commit count using the Search API, with support for anonymous requests.
    /// </summary>
    private async Task<string> GetGitHubCommitsAsync(string? gitHubUsername)
    {
        if (string.IsNullOrEmpty(gitHubUsername))
            return "0";

        var cacheKey = $"GitHubCommits_{gitHubUsername}";
        if (_cache.TryGetValue(cacheKey, out string? cachedCommits) && cachedCommits != null)
        {
            return cachedCommits;
        }

        try
        {
            var gitHubToken = _configuration["GitHub:Token"];
            // Treat placeholders as missing
            if (gitHubToken != null && (gitHubToken.Contains("#{") || gitHubToken.Contains("your-github-token")))
            {
                gitHubToken = null;
            }

            // Use the Search Commits API to get an actual commit count
            var request = new HttpRequestMessage(HttpMethod.Get, $"https://api.github.com/search/commits?q=author:{gitHubUsername}");
            
            if (!string.IsNullOrEmpty(gitHubToken))
            {
                request.Headers.Add("Authorization", $"Bearer {gitHubToken}");
            }
            
            request.Headers.Add("Accept", "application/vnd.github.cloak-preview"); // Required for commit search
            request.Headers.Add("User-Agent", "Portfolio-API");

            var response = await _httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode)
            {
                // Fallback to repo count if search fails
                return await GetGitHubRepoCountAsync(gitHubUsername, gitHubToken);
            }

            var content = await response.Content.ReadAsStringAsync();
            var jsonDoc = System.Text.Json.JsonDocument.Parse(content);
            var root = jsonDoc.RootElement;

            if (root.TryGetProperty("total_count", out var totalCount))
            {
                var count = totalCount.GetInt32();
                var result = count.ToString();
                
                _cache.Set(cacheKey, result, new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(4)
                });
                
                return result;
            }

            return "0";
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"❌ Error in GetGitHubCommitsAsync: {ex.Message}");
            return "0";
        }
    }

    /// <summary>
    /// Fetches the public repository count for a GitHub user, allowing anonymous access.
    /// </summary>
    private async Task<string> GetGitHubRepoCountAsync(string username, string? token)
    {
        var cacheKey = $"GitHubRepoCount_{username}";
        if (_cache.TryGetValue(cacheKey, out string? cachedRepos) && cachedRepos != null)
        {
            return cachedRepos;
        }

        try 
        {
            var request = new HttpRequestMessage(HttpMethod.Get, $"https://api.github.com/users/{username}");
            
            if (!string.IsNullOrEmpty(token) && !token.Contains("#{") && !token.Contains("your-github-token"))
            {
                request.Headers.Add("Authorization", $"Bearer {token}");
            }
            
            request.Headers.Add("Accept", "application/vnd.github.v3+json");
            request.Headers.Add("User-Agent", "Portfolio-API");

            var response = await _httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("GitHub Repo Count API failed for {Username}: {Status}", username, response.StatusCode);
                return "0";
            }

            var content = await response.Content.ReadAsStringAsync();
            using var jsonDoc = System.Text.Json.JsonDocument.Parse(content);
            if (jsonDoc.RootElement.TryGetProperty("public_repos", out var repos))
            {
                var result = repos.GetInt32().ToString();
                
                _cache.Set(cacheKey, result, new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(4)
                });
                
                return result;
            }

            return "0";
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetGitHubRepoCountAsync for {Username}", username);
            return "0";
        }
    }
}



