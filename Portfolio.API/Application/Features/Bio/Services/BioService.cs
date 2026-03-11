using Portfolio.API.Entities;
using Portfolio.API.Repositories;
using Portfolio.API.Application.Features.Bio.DTOs;
using Portfolio.API.Application.Features.Bio.Mappers;
using Portfolio.API.Domain.Enums;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using BioEntity = Portfolio.API.Entities.Bio;

namespace Portfolio.API.Application.Features.Bio.Services;

public class BioService : IBioService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IConfiguration _configuration;
    private readonly HttpClient _httpClient;

<<<<<<< HEAD
=======
    /// <summary>
    /// Initializes a new instance of the <see cref="BioService"/> class with its required dependencies.
    /// </summary>
>>>>>>> origin/master
    public BioService(IUnitOfWork unitOfWork, IConfiguration configuration, HttpClient httpClient)
    {
        _unitOfWork = unitOfWork;
        _configuration = configuration;
        _httpClient = httpClient;
    }

<<<<<<< HEAD
=======
    /// <summary>
    /// Retrieves the primary bio, loads its related signature and technical focus, updates runtime statistics, and returns the mapped DTO.
    /// </summary>
    /// <param name="cancellationToken">Token to cancel the operation.</param>
    /// <returns>The mapped <see cref="BioDto"/> for the first bio found, or <c>null</c> if no bio exists.</returns>
>>>>>>> origin/master
    public async Task<BioDto?> GetBioAsync(CancellationToken cancellationToken = default)
    {
        var bios = await _unitOfWork.Repository<BioEntity>().GetAllAsync();
        var bio = bios.FirstOrDefault();
        if (bio == null) return null;

        // Load related entities
        var signatures = await _unitOfWork.Repository<Signature>().GetAllAsync();
        var technicalFocuses = await _unitOfWork.Repository<TechnicalFocus>().GetAllAsync();
        
        bio.Signature = signatures.FirstOrDefault(s => s.BioId == bio.Id);
        bio.TechnicalFocus = technicalFocuses.FirstOrDefault(tf => tf.BioId == bio.Id);

        // Calculate dynamic statistics
        bio.YearsOfExperience = CalculateYearsOfExperience(bio.CareerStartDate);
        bio.ProjectsCompleted = await GetProjectsCompletedCountAsync();
        bio.CodeCommits = await GetGitHubCommitsAsync(bio.GitHubUsername);

        return BioMapper.ToDto(bio);
    }

<<<<<<< HEAD
=======
    /// <summary>
    /// Creates or updates the site's bio using the provided data and returns the updated DTO.
    /// </summary>
    /// <param name="id">Identifier to assign when creating a new bio if none exists.</param>
    /// <param name="dto">Data to apply to the bio.</param>
    /// <param name="cancellationToken">Token to observe while performing the operation.</param>
    /// <returns>The updated <see cref="BioDto"/> reflecting persisted changes and recalculated dynamic fields (years of experience, projects completed, code commits).</returns>
>>>>>>> origin/master
    public async Task<BioDto> UpdateBioAsync(Guid id, BioDto dto, CancellationToken cancellationToken = default)
    {
        var repository = _unitOfWork.Repository<BioEntity>();
        var bios = await repository.GetAllAsync();
        var bio = bios.FirstOrDefault();

        if (bio == null)
        {
            bio = new BioEntity { Id = id };
            await repository.AddAsync(bio);
        }

        // Load related entities
        var signatures = await _unitOfWork.Repository<Signature>().GetAllAsync();
        var technicalFocuses = await _unitOfWork.Repository<TechnicalFocus>().GetAllAsync();
        
        bio.Signature = signatures.FirstOrDefault(s => s.BioId == bio.Id);
        bio.TechnicalFocus = technicalFocuses.FirstOrDefault(tf => tf.BioId == bio.Id);

        BioMapper.UpdateEntity(bio, dto);
        await _unitOfWork.CompleteAsync();

        // Recalculate dynamic statistics after update
        bio.YearsOfExperience = CalculateYearsOfExperience(bio.CareerStartDate);
        bio.ProjectsCompleted = await GetProjectsCompletedCountAsync();
        bio.CodeCommits = await GetGitHubCommitsAsync(bio.GitHubUsername);

        return BioMapper.ToDto(bio);
    }

<<<<<<< HEAD
=======
    /// <summary>
    /// Calculate the number of full years since the specified career start date and format the result with a trailing '+'.
    /// </summary>
    /// <param name="careerStartDate">The UTC date when the career began; used as the reference point for computing full years of experience.</param>
    /// <returns>A string in the format "&lt;years&gt;+" where &lt;years&gt; is the number of full years since <paramref name="careerStartDate"/>, with a minimum of 0.</returns>
>>>>>>> origin/master
    private string CalculateYearsOfExperience(DateTime careerStartDate)
    {
        var years = DateTime.UtcNow.Year - careerStartDate.Year;
        if (DateTime.UtcNow.Month < careerStartDate.Month ||
            (DateTime.UtcNow.Month == careerStartDate.Month && DateTime.UtcNow.Day < careerStartDate.Day))
        {
            years--;
        }
        return $"{Math.Max(years, 0)}+";
    }

<<<<<<< HEAD
=======
    /// <summary>
    /// Retrieve the number of completed projects.
    /// </summary>
    /// <returns>The count of projects whose Status equals <c>ProjectStatus.Completed</c>, returned as a string; returns "0" if an error occurs.</returns>
>>>>>>> origin/master
    private async Task<string> GetProjectsCompletedCountAsync()
    {
        try
        {
            var projects = await _unitOfWork.Repository<Project>().GetAllAsync();
            var completedCount = projects.Count(p => p.Status == ProjectStatus.Completed);
            return completedCount.ToString();
        }
        catch
        {
            return "0";
        }
    }

<<<<<<< HEAD
=======
    /// <summary>
    /// Retrieves a GitHub user's public repository count from the GitHub API.
    /// </summary>
    /// <param name="gitHubUsername">The GitHub username to query; if null or empty the method returns "0".</param>
    /// <returns>The number of public repositories for the specified user as a string, or "0" if the username is missing, the GitHub token is not configured, the API call fails, or the response cannot be parsed.</returns>
>>>>>>> origin/master
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



