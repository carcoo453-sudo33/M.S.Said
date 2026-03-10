using Microsoft.EntityFrameworkCore;
using Portfolio.API.Features.Projects.DTOs;
using Portfolio.API.Features.Projects.Mappers;
using Portfolio.API.Features.Projects.Queries;
using Portfolio.API.Features.Projects.Validation;
using Portfolio.API.Repositories;
using Portfolio.API.Entities;
using Portfolio.API.Constants;
using Portfolio.API.DTOs;
using Portfolio.API.Services;
using Portfolio.API.Helpers;

namespace Portfolio.API.Features.Projects.Services;

public class ProjectService : IProjectService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly INotificationService _notificationService;
    private readonly ILogger<ProjectService> _logger;
    private readonly GetProjectsQueryHandler _getProjectsQueryHandler;
    private readonly GetProjectBySlugQueryHandler _getProjectBySlugQueryHandler;
    private readonly GetFeaturedProjectsQueryHandler _getFeaturedProjectsQueryHandler;
    private readonly GetRelatedProjectsQueryHandler _getRelatedProjectsQueryHandler;
    private readonly SlugExistsQueryHandler _slugExistsQueryHandler;

    public ProjectService(
        IUnitOfWork unitOfWork,
        INotificationService notificationService,
        ILogger<ProjectService> logger)
    {
        _unitOfWork = unitOfWork;
        _notificationService = notificationService;
        _logger = logger;
        
        // Initialize query handlers
        _getProjectsQueryHandler = new GetProjectsQueryHandler(unitOfWork);
        _getProjectBySlugQueryHandler = new GetProjectBySlugQueryHandler(unitOfWork);
        _getFeaturedProjectsQueryHandler = new GetFeaturedProjectsQueryHandler(unitOfWork);
        _getRelatedProjectsQueryHandler = new GetRelatedProjectsQueryHandler(unitOfWork);
        _slugExistsQueryHandler = new SlugExistsQueryHandler(unitOfWork);
    }

    public async Task<PagedResult<ProjectDto>> GetProjectsAsync(ProjectQueryDto parameters)
    {
        return await _getProjectsQueryHandler.HandleAsync(parameters);
    }

    public async Task<ProjectDto?> GetProjectBySlugAsync(string slug)
    {
        var projectDto = await _getProjectBySlugQueryHandler.HandleAsync(slug);

        if (projectDto == null)
        {
            _logger.LogWarning("Project with slug {Slug} not found", slug);
            return null;
        }

        // Get the entity to update view count
        var project = await _unitOfWork.Repository<Project>()
            .GetByIdAsync(projectDto.Id);

        if (project != null)
        {
            // Increment view count
            project.Views++;
            project.UpdatedAt = DateTime.UtcNow;
            await _unitOfWork.CompleteAsync();

            // Create notification for project view
            await _notificationService.CreateNotificationAsync(
                NotificationTypeConstants.ProjectView,
                "Project Viewed",
                $"Project '{project.Title}' was viewed",
                $"/projects/{project.Slug}",
                "eye",
                project.Id.ToString(),
                "Project"
            );

            // Update the DTO with new view count
            projectDto.Views = project.Views;
        }

        return projectDto;
    }

    public async Task<List<ProjectDto>> GetFeaturedProjectsAsync()
    {
        return await _getFeaturedProjectsQueryHandler.HandleAsync();
    }

    public async Task<List<ProjectDto>> GetRelatedProjectsAsync(string slug)
    {
        return await _getRelatedProjectsQueryHandler.HandleAsync(slug);
    }

    public async Task<ProjectDto> CreateProjectAsync(ProjectCreateDto request)
    {
        _logger.LogInformation("Creating new project: {Title}", request.Title);

        // Validate request
        var validation = ProjectValidation.ValidateCreateRequest(request);
        if (!validation.IsValid)
        {
            throw new ArgumentException(string.Join(", ", validation.Errors));
        }

        // Check for duplicate slug
        var baseSlug = SlugHelper.GenerateSlug(request.Title);
        var slug = await GenerateUniqueSlugAsync(baseSlug);

        var project = ProjectMapper.ToEntity(request);
        project.Id = Guid.NewGuid();
        project.Slug = slug;
        project.CreatedAt = DateTime.UtcNow;
        project.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.Repository<Project>().AddAsync(project);
        await _unitOfWork.CompleteAsync();

        _logger.LogInformation("Project created successfully: {ProjectId}", project.Id);
        return ProjectMapper.ToResponse(project);
    }

    public async Task<ProjectDto> UpdateProjectAsync(Guid id, ProjectUpdateDto request)
    {
        _logger.LogInformation("Updating project: {ProjectId}", id);

        // Validate request
        var validation = ProjectValidation.ValidateUpdateRequest(request);
        if (!validation.IsValid)
        {
            throw new ArgumentException(string.Join(", ", validation.Errors));
        }

        var project = await _unitOfWork.Repository<Project>()
            .Query()
            .Include(p => p.KeyFeatures)
            .Include(p => p.Changelog)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (project == null)
        {
            throw new ArgumentException("Project not found");
        }

        // Check for duplicate slug (excluding current project)
        var baseSlug = SlugHelper.GenerateSlug(request.Title);
        if (project.Slug != baseSlug)
        {
            var slug = await GenerateUniqueSlugAsync(baseSlug, id);
            project.Slug = slug;
        }

        ProjectMapper.UpdateEntity(project, request);
        project.UpdatedAt = DateTime.UtcNow;

        _unitOfWork.Repository<Project>().Update(project);
        await _unitOfWork.CompleteAsync();

        _logger.LogInformation("Project updated successfully: {ProjectId}", id);
        return ProjectMapper.ToResponse(project);
    }

    public async Task DeleteProjectAsync(Guid id)
    {
        _logger.LogInformation("Deleting project: {ProjectId}", id);

        var project = await _unitOfWork.Repository<Project>().GetByIdAsync(id);
        if (project == null)
        {
            throw new ArgumentException("Project not found");
        }

        _unitOfWork.Repository<Project>().Delete(project);
        await _unitOfWork.CompleteAsync();

        _logger.LogInformation("Project deleted successfully: {ProjectId}", id);
    }

    public async Task<ProjectDto> ImportFromGitHubAsync(Guid projectId, string githubUrl)
    {
        _logger.LogInformation("Importing GitHub data for project: {ProjectId}", projectId);

        if (!UrlHelper.IsValidGitHubUrl(githubUrl))
        {
            throw new ArgumentException("Invalid GitHub URL format");
        }

        var project = await _unitOfWork.Repository<Project>().GetByIdAsync(projectId);
        if (project == null)
        {
            throw new ArgumentException("Project not found");
        }

        // TODO: Implement GitHub API integration
        // For now, just update the GitHub URL
        project.RepoUrl = githubUrl;
        project.UpdatedAt = DateTime.UtcNow;

        _unitOfWork.Repository<Project>().Update(project);
        await _unitOfWork.CompleteAsync();

        return ProjectMapper.ToResponse(project);
    }

    private async Task<string> GenerateUniqueSlugAsync(string baseSlug, Guid? excludeId = null)
    {
        var slug = baseSlug;
        var counter = 1;

        while (await SlugExistsAsync(slug, excludeId))
        {
            slug = $"{baseSlug}-{counter}";
            counter++;
        }

        return slug;
    }

    private async Task<bool> SlugExistsAsync(string slug, Guid? excludeId = null)
    {
        return await _slugExistsQueryHandler.HandleAsync(slug, excludeId);
    }
}