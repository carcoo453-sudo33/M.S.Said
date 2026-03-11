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
        ILogger<ProjectService> logger,
        GetProjectsQueryHandler getProjectsQueryHandler,
        GetProjectBySlugQueryHandler getProjectBySlugQueryHandler,
        GetFeaturedProjectsQueryHandler getFeaturedProjectsQueryHandler,
        GetRelatedProjectsQueryHandler getRelatedProjectsQueryHandler,
        SlugExistsQueryHandler slugExistsQueryHandler)
    {
        _unitOfWork = unitOfWork;
        _notificationService = notificationService;
        _logger = logger;
        
        _getProjectsQueryHandler = getProjectsQueryHandler;
        _getProjectBySlugQueryHandler = getProjectBySlugQueryHandler;
        _getFeaturedProjectsQueryHandler = getFeaturedProjectsQueryHandler;
        _getRelatedProjectsQueryHandler = getRelatedProjectsQueryHandler;
        _slugExistsQueryHandler = slugExistsQueryHandler;
    }

    /// <summary>
    /// Retrieves a paged list of projects based on the provided query parameters.
    /// </summary>
    /// <param name="parameters">The query parameters for filtering, searching, and pagination.</param>
    /// <param name="cancellationToken">Token to cancel the request.</param>
    /// <returns>A paged result containing the list of matching project DTOs.</returns>
    public async Task<PagedResult<ProjectDto>> GetProjectsAsync(ProjectQueryDto parameters, CancellationToken cancellationToken = default)
    {
        return await _getProjectsQueryHandler.HandleAsync(parameters, cancellationToken);
    }

    /// <summary>
    /// Retrieves a single project by its unique slug.
    /// </summary>
    /// <param name="slug">The project's unique URL-friendly slug.</param>
    /// <param name="cancellationToken">Token to cancel the request.</param>
    /// <returns>The project DTO if found; otherwise, null.</returns>
    public async Task<ProjectDto?> GetProjectBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        var project = await _unitOfWork.Repository<Project>()
            .Query()
            .Include(p => p.KeyFeatures)
            .Include(p => p.Changelog)
            .Include(p => p.Comments)
            .FirstOrDefaultAsync(p => p.Slug == slug, cancellationToken);

        if (project == null)
        {
            _logger.LogWarning("Project with slug {Slug} not found", slug);
            return null;
        }

        return ProjectMapper.ToResponse(project);
    }

    /// <summary>
    /// Increments the view count for a specific project and creates a notification.
    /// This method is separated from the GET request to maintain idempotency.
    /// </summary>
    /// <param name="slug">The project's slug.</param>
    /// <param name="cancellationToken">Token to cancel the request.</param>
    /// <returns>True if the project was found and updated; otherwise, false.</returns>
    public async Task<bool> TrackProjectViewAsync(string slug, CancellationToken cancellationToken = default)
    {
        var project = await _unitOfWork.Repository<Project>().Query().FirstOrDefaultAsync(p => p.Slug == slug, cancellationToken);
        if (project == null) return false;

        project.Views++;
        project.UpdatedAt = DateTime.UtcNow;
        await _unitOfWork.CompleteAsync(cancellationToken);

        await _notificationService.CreateNotificationAsync(
            NotificationTypeConstants.ProjectView,
            "Project Viewed",
            $"Project '{project.Title}' was viewed",
            $"/projects/{project.Slug}",
            "eye",
            project.Id.ToString(),
            "Project",
            "Anonymous"
        );

        return true;
    }

    /// <summary>
    /// Retrieves a list of featured projects for the portfolio homepage.
    /// </summary>
    /// <param name="cancellationToken">Token to cancel the request.</param>
    /// <returns>A list of featured project DTOs.</returns>
    public async Task<List<ProjectDto>> GetFeaturedProjectsAsync(CancellationToken cancellationToken = default)
    {
        return await _getFeaturedProjectsQueryHandler.HandleAsync(cancellationToken);
    }

    /// <summary>
    /// Retrieves projects related to a given project based on category or featured status.
    /// </summary>
    /// <param name="slug">The slug of the source project.</param>
    /// <param name="cancellationToken">Token to cancel the request.</param>
    /// <returns>A list of related project DTOs.</returns>
    public async Task<List<ProjectDto>> GetRelatedProjectsAsync(string slug, CancellationToken cancellationToken = default)
    {
        return await _getRelatedProjectsQueryHandler.HandleAsync(slug, cancellationToken);
    }

    /// <summary>
    /// Creates a new project in the database, generating a unique slug and persisting child entities.
    /// </summary>
    /// <param name="request">The project creation details.</param>
    /// <param name="cancellationToken">Token to cancel the request.</param>
    /// <returns>The created project DTO.</returns>
    public async Task<ProjectDto> CreateProjectAsync(ProjectCreateDto request, CancellationToken cancellationToken = default)
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

        // Map child entities now that we have a valid ProjectId
        project.KeyFeatures = request.KeyFeatures?.Select(kf => KeyFeatureMapper.ToEntity(kf, project.Id)).ToList() ?? new();
        project.Changelog = request.Changelog?.Select(cl => ChangelogItemMapper.ToEntity(cl, project.Id)).ToList() ?? new();
        project.Images = request.Images?.Select(img => new Portfolio.API.Entities.ProjectImage
        {
            ProjectId = project.Id,
            ImageUrl = img.ImageUrl,
            Title = img.Title,
            Title_Ar = img.Title_Ar,
            Type = img.Type,
            Order = img.Order,
            Description = img.Description,
            Description_Ar = img.Description_Ar
        }).ToList() ?? new();

        await _unitOfWork.Repository<Project>().AddAsync(project);
        await _unitOfWork.CompleteAsync();

        _logger.LogInformation("Project created successfully: {ProjectId}", project.Id);
        return ProjectMapper.ToResponse(project);
    }

    /// <summary>
    /// Updates an existing project and its child entities.
    /// </summary>
    /// <param name="id">The unique identifier of the project to update.</param>
    /// <param name="request">The updated project details.</param>
    /// <param name="cancellationToken">Token to cancel the request.</param>
    /// <returns>The updated project DTO if found; otherwise, null.</returns>
    public async Task<ProjectDto?> UpdateProjectAsync(Guid id, ProjectUpdateDto request, CancellationToken cancellationToken = default)
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
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);

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

    /// <summary>
    /// Deletes a project and its associated data from the database.
    /// </summary>
    /// <param name="id">The unique identifier of the project to delete.</param>
    /// <param name="cancellationToken">Token to cancel the request.</param>
    /// <returns>True if the project was successfully deleted; otherwise, false.</returns>
    public async Task<bool> DeleteProjectAsync(Guid id, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Deleting project: {ProjectId}", id);

        var project = await _unitOfWork.Repository<Project>().GetByIdAsync(id);
        if (project == null)
        {
            _logger.LogWarning("Project not found: {ProjectId}", id);
            return false;
        }

        _unitOfWork.Repository<Project>().Delete(project);
        await _unitOfWork.CompleteAsync(cancellationToken);

        _logger.LogInformation("Project deleted successfully: {ProjectId}", id);
        return true;
    }
    /// <summary>
    /// Scrapes metadata from a given URL to facilitate project import.
    /// </summary>
    /// <param name="request">The import request containing the target URL.</param>
    /// <param name="cancellationToken">Token to cancel the request.</param>
    /// <returns>A populated ProjectDto if metadata extraction was successful; otherwise, null.</returns>
    public async Task<ProjectDto?> ImportFromUrlAsync(ImportRequest request, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Importing project data from URL: {Url}", request.Url);

        var extractor = new MetadataExtractor();
        var metadata = await extractor.ExtractMetadata(request.Url);

        if (metadata == null)
            return null;

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


