using Portfolio.API.Entities;
using Portfolio.API.Repositories;
using Portfolio.API.Application.Features.Bio.DTOs;
using Portfolio.API.Application.Features.Bio.Mappers;
using Portfolio.API.Domain.Enums;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using BioEntity = Portfolio.API.Entities.Bio;

namespace Portfolio.API.Application.Features.Bio.Services;

public class BioService : IBioService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IConfiguration _configuration;
    private readonly HttpClient _httpClient;
    private readonly IMemoryCache _cache;

    /// <summary>
    /// Initializes a new instance of the <see cref="BioService"/> class with its required dependencies.
    /// </summary>
    public BioService(IUnitOfWork unitOfWork, IConfiguration configuration, HttpClient httpClient, IMemoryCache cache)
    {
        _unitOfWork = unitOfWork;
        _configuration = configuration;
        _httpClient = httpClient;
        _cache = cache;
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

        // Calculate dynamic statistics
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
        System.Diagnostics.Debug.WriteLine($"🔍 UpdateBioAsync called with ID: {id}");
        System.Diagnostics.Debug.WriteLine($"📥 Received DTO - CareerStartDate: {dto.CareerStartDate}, GitHubUsername: {dto.GitHubUsername}");
        
        var repository = _unitOfWork.Repository<BioEntity>();
        
        // Single query with eager loading of related entities
        var bio = await repository.Query()
            .AsTracking()
            .Include(b => b.Signature)
            .Include(b => b.TechnicalFocus)
            .FirstOrDefaultAsync(cancellationToken);

        bool isNew = bio == null;
        if (bio == null)
        {
            bio = new BioEntity { Id = id };
        }

        BioMapper.UpdateEntity(bio, dto);
        System.Diagnostics.Debug.WriteLine($"🔄 After mapping - CareerStartDate: {bio.CareerStartDate}, GitHubUsername: {bio.GitHubUsername}");
        
        // Add new bio or update existing
        if (isNew)
        {
            await repository.AddAsync(bio);
        }
        else
        {
            repository.Update(bio);
        }
        
        // Save changes to database
        var saveResult = await _unitOfWork.CompleteAsync(cancellationToken);
        System.Diagnostics.Debug.WriteLine($"✅ Bio saved successfully. Changes: {saveResult}");

        // Recalculate dynamic statistics after update
        bio.YearsOfExperience = await CalculateYearsOfExperienceAsync(bio.CareerStartDate);
        bio.ProjectsCompleted = await GetProjectsCompletedCountAsync();
        bio.CodeCommits = await GetGitHubCommitsAsync(bio.GitHubUsername);

        System.Diagnostics.Debug.WriteLine($"📊 Updated Bio Statistics - Years: {bio.YearsOfExperience}, Projects: {bio.ProjectsCompleted}, Commits: {bio.CodeCommits}, CareerStartDate: {bio.CareerStartDate}, GitHubUsername: {bio.GitHubUsername}");

        return BioMapper.ToDto(bio);
    }

    /// <summary>
    /// Calculate the number of full years since the specified career start date or earliest experience entry.
    /// </summary>
    private async Task<string> CalculateYearsOfExperienceAsync(DateTime careerStartDate)
    {
        var referenceDate = careerStartDate;
        
        // If CareerStartDate is the default (2021-01-01) or uninitialized, try to find the earliest experience
        var defaultDate = new DateTime(2021, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        if (careerStartDate <= defaultDate)
        {
            var earliestExperience = await _unitOfWork.Repository<Experience>()
                .Query()
                .AsNoTracking()
                .OrderBy(e => e.Duration) // Simple alphabetical sort on duration string often yields years first
                .ToListAsync();

            if (earliestExperience.Any())
            {
                // Try to extract the minimum year from all durations
                var years = earliestExperience
                    .Select(e => ExtractYear(e.Duration))
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
        
        // Return 0+ if no experience found, else return calculated years
        return $"{Math.Max(experienceYears, 0)}+";
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
    /// Retrieve the number of completed projects.
    /// </summary>
    /// <returns>The count of projects whose Status equals <c>ProjectStatus.Completed</c>, returned as a string; returns "0" if an error occurs.</returns>
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
            
            // If zero completed, count InProgress too to avoid showing "0" to visitors
            var totalCount = completedCount;
            if (totalCount == 0)
            {
                totalCount = await query.CountAsync(p => p.Status == ProjectStatus.Completed || p.Status == ProjectStatus.InProgress);
            }
            
            var result = totalCount.ToString();
            
            _cache.Set(cacheKey, result, new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1)
            });

            return result;
        }
        catch
        {
            return "0";
        }
    }

    /// <summary>
    /// Retrieves a GitHub user's public repository count from the GitHub API.
    /// </summary>
    /// <param name="gitHubUsername">The GitHub username to query; if null or empty the method returns "0".</param>
    /// <returns>The number of public repositories for the specified user as a string, or "0" if the username is missing, the GitHub token is not configured, the API call fails, or the response cannot be parsed.</returns>
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
            if (string.IsNullOrEmpty(gitHubToken))
                return "0";

            // Use the Search Commits API to get an actual commit count
            // Reference: https://docs.github.com/en/rest/search/search?apiVersion=2022-11-28#search-commits
            var request = new HttpRequestMessage(HttpMethod.Get, $"https://api.github.com/search/commits?q=author:{gitHubUsername}");
            request.Headers.Add("Authorization", $"Bearer {gitHubToken}");
            request.Headers.Add("Accept", "application/vnd.github.cloak-preview"); // Required for commit search
            request.Headers.Add("User-Agent", "Portfolio-API");

            var response = await _httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode)
            {
                // Fallback to repo count if search is restricted or fails
                return await GetGitHubRepoCountAsync(gitHubUsername, gitHubToken);
            }

            var content = await response.Content.ReadAsStringAsync();
            var jsonDoc = System.Text.Json.JsonDocument.Parse(content);
            var root = jsonDoc.RootElement;

            if (root.TryGetProperty("total_count", out var totalCount))
            {
                var result = totalCount.GetInt32().ToString();
                
                _cache.Set(cacheKey, result, new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(6) // Commit count doesn't change that fast
                });
                
                return result;
            }

            return "0";
        }
        catch
        {
            return "0";
        }
    }

    private async Task<string> GetGitHubRepoCountAsync(string username, string token)
    {
        var request = new HttpRequestMessage(HttpMethod.Get, $"https://api.github.com/users/{username}");
        request.Headers.Add("Authorization", $"Bearer {token}");
        request.Headers.Add("Accept", "application/vnd.github.v3+json");
        request.Headers.Add("User-Agent", "Portfolio-API");

        var response = await _httpClient.SendAsync(request);
        if (!response.IsSuccessStatusCode) return "0";

        var content = await response.Content.ReadAsStringAsync();
        using var jsonDoc = System.Text.Json.JsonDocument.Parse(content);
        if (jsonDoc.RootElement.TryGetProperty("public_repos", out var repos))
            return repos.GetInt32().ToString();

        return "0";
    }
}



