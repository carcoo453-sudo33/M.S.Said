using Portfolio.API.Entities;
using Portfolio.API.Repositories;
using Portfolio.API.Application.Features.Bio.DTOs;
using Portfolio.API.Application.Features.Bio.Mappers;
using Portfolio.API.Domain.Enums;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using System.Net.Http;
using BioEntity = Portfolio.API.Entities.Bio;

namespace Portfolio.API.Application.Features.Bio.Services;

public class BioService : IBioService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IConfiguration _configuration;
    private readonly HttpClient _httpClient;

    /// <summary>
    /// Initializes a new instance of the <see cref="BioService"/> class with its required dependencies.
    /// </summary>
    public BioService(IUnitOfWork unitOfWork, IConfiguration configuration, HttpClient httpClient)
    {
        _unitOfWork = unitOfWork;
        _configuration = configuration;
        _httpClient = httpClient;
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
        bio.YearsOfExperience = CalculateYearsOfExperience(bio.CareerStartDate);
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
        bio.YearsOfExperience = CalculateYearsOfExperience(bio.CareerStartDate);
        bio.ProjectsCompleted = await GetProjectsCompletedCountAsync();
        bio.CodeCommits = await GetGitHubCommitsAsync(bio.GitHubUsername);

        System.Diagnostics.Debug.WriteLine($"📊 Updated Bio Statistics - Years: {bio.YearsOfExperience}, Projects: {bio.ProjectsCompleted}, Commits: {bio.CodeCommits}, CareerStartDate: {bio.CareerStartDate}, GitHubUsername: {bio.GitHubUsername}");

        return BioMapper.ToDto(bio);
    }

    /// <summary>
    /// Calculate the number of full years since the specified career start date and format the result with a trailing '+'.
    /// </summary>
    /// <param name="careerStartDate">The UTC date when the career began; used as the reference point for computing full years of experience.</param>
    /// <returns>A string in the format "&lt;years&gt;+" where &lt;years&gt; is the number of full years since <paramref name="careerStartDate"/>, with a minimum of 0.</returns>
    private static string CalculateYearsOfExperience(DateTime careerStartDate)
    {
        var years = DateTime.UtcNow.Year - careerStartDate.Year;
        if (DateTime.UtcNow.Month < careerStartDate.Month ||
            (DateTime.UtcNow.Month == careerStartDate.Month && DateTime.UtcNow.Day < careerStartDate.Day))
        {
            years--;
        }
        return $"{Math.Max(years, 0)}+";
    }

    /// <summary>
    /// Retrieve the number of completed projects.
    /// </summary>
    /// <returns>The count of projects whose Status equals <c>ProjectStatus.Completed</c>, returned as a string; returns "0" if an error occurs.</returns>
    private async Task<string> GetProjectsCompletedCountAsync()
    {
        try
        {
            var completedCount = await _unitOfWork.Repository<Project>()
                .Query()
                .AsNoTracking()
                .CountAsync(p => p.Status == ProjectStatus.Completed);
            return completedCount.ToString();
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

        try
        {
            var gitHubToken = _configuration["GitHub:Token"];
            if (string.IsNullOrEmpty(gitHubToken))
                return "0";

            var request = new HttpRequestMessage(HttpMethod.Get, $"https://api.github.com/users/{gitHubUsername}");
            request.Headers.Add("Authorization", $"Bearer {gitHubToken}");
            request.Headers.Add("Accept", "application/vnd.github.v3+json");
            request.Headers.Add("User-Agent", "Portfolio-API");

            var response = await _httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode)
                return "0";

            var content = await response.Content.ReadAsStringAsync();
            var jsonDoc = System.Text.Json.JsonDocument.Parse(content);
            var root = jsonDoc.RootElement;

            if (root.TryGetProperty("public_repos", out var publicRepos))
            {
                return publicRepos.GetInt32().ToString();
            }

            return "0";
        }
        catch
        {
            return "0";
        }
    }
}



