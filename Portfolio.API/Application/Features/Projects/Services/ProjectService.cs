using Microsoft.EntityFrameworkCore;
using Portfolio.API.Repositories;
using Portfolio.API.Application.Features.Projects.DTOs;
using Portfolio.API.Application.Features.Projects.Mappers;
using Portfolio.API.Application.Features.Projects.Queries;
using Portfolio.API.Application.Features.Projects.Validation;
using Portfolio.API.Entities;
using Portfolio.API.Constants;
using Portfolio.API.Application.Common;
using Portfolio.API.Application.Features.Notifications.Services;
using Portfolio.API.Helpers;
using HtmlAgilityPack;

namespace Portfolio.API.Application.Features.Projects.Services;

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
        var project = await _unitOfWork.Repository<Project>()
            .Query()
            .Include(p => p.KeyFeatures)
            .Include(p => p.Changelog)
            .Include(p => p.Comments)
            .FirstOrDefaultAsync(p => p.Slug == slug);

        if (project == null)
        {
            _logger.LogWarning("Project with slug {Slug} not found", slug);
            return null;
        }

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

        return ProjectMapper.ToResponse(project);
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

    public async Task<ProjectDto?> UpdateProjectAsync(Guid id, ProjectUpdateDto request)
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
            _logger.LogWarning("Project not found: {ProjectId}", id);
            return null;
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

    public async Task<bool> DeleteProjectAsync(Guid id)
    {
        _logger.LogInformation("Deleting project: {ProjectId}", id);

        var project = await _unitOfWork.Repository<Project>().GetByIdAsync(id);
        if (project == null)
        {
            _logger.LogWarning("Project not found: {ProjectId}", id);
            return false;
        }

        _unitOfWork.Repository<Project>().Delete(project);
        await _unitOfWork.CompleteAsync();

        _logger.LogInformation("Project deleted successfully: {ProjectId}", id);
        return true;
    }

    public async Task<ProjectDto> ImportFromUrlAsync(ImportRequest request)
    {
        _logger.LogInformation("Importing project data from URL: {Url}", request.Url);

        var extractor = new MetadataExtractor();
        var metadata = await extractor.ExtractMetadata(request.Url);

        // Map metadata to a DTO
        return new ProjectDto
        {
            Title = metadata.Title,
            Description = metadata.Description ?? metadata.Content,
            Summary = metadata.Description,
            GitHubUrl = request.Url.Contains("github.com") ? request.Url : null,
            ProjectUrl = request.Url,
            TechStack = metadata.Tags,
            CreatedAt = metadata.PublishedDate ?? DateTime.UtcNow
        };
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


