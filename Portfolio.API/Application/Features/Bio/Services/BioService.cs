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

    public BioService(IUnitOfWork unitOfWork, IConfiguration configuration, HttpClient httpClient)
    {
        _unitOfWork = unitOfWork;
        _configuration = configuration;
        _httpClient = httpClient;
    }

    public async Task<BioDto?> GetBioAsync()
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

    public async Task<BioDto> UpdateBioAsync(Guid id, BioDto dto)
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



