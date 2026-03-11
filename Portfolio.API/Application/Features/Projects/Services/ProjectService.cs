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
    /// Retrieves the project identified by the given slug and records a view for it.
    /// </summary>
    /// <param name="slug">The unique URL-friendly identifier of the project.</param>
    /// <returns>`ProjectDto` for the matching project, or `null` if no project with the given slug exists. The method also increments the project's view count, updates its UpdatedAt timestamp, persists those changes, and creates a project-view notification.</returns>
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

    /// <summary>
    /// Retrieves the collection of featured projects.
    /// </summary>
    /// <returns>A list of featured ProjectDto objects.</returns>
    public async Task<List<ProjectDto>> GetFeaturedProjectsAsync()
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
    /// Creates a new project from the provided creation data, persists it, and returns the created project.
    /// </summary>
    /// <param name="request">The project creation DTO containing the project's input fields (for example: title, description, summary, tech stack).</param>
    /// <returns>The created project's DTO including assigned Id, Slug, CreatedAt, and UpdatedAt.</returns>
    /// <exception cref="ArgumentException">Thrown when the creation request fails validation; the exception message contains the validation errors.</exception>
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
    /// Updates an existing project with values from the provided request and persists the changes.
    /// </summary>
    /// <param name="id">The identifier of the project to update.</param>
    /// <param name="request">The updated project data.</param>
    /// <returns>The updated ProjectDto if the project was found and updated; `null` if no project with the specified ID exists.</returns>
    /// <exception cref="ArgumentException">Thrown when the update request fails validation; the exception message contains validation errors.</exception>
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
    /// Deletes the project with the specified identifier from the repository.
    /// </summary>
    /// <param name="id">The unique identifier of the project to delete.</param>
    /// <returns>True if the project was found and deleted, false otherwise.</returns>
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
        await _unitOfWork.CompleteAsync(cancellationToken);

        _logger.LogInformation("Project deleted successfully: {ProjectId}", id);
        return true;
    }

    /// <summary>
    /// Builds a ProjectDto by extracting metadata from the provided URL and mapping relevant fields.
    /// </summary>
    /// <param name="request">The import request containing the source URL.</param>
    /// <returns>
    /// A ProjectDto populated from extracted metadata: Title, Description (or Content when Description is absent), Summary, TechStack, ProjectUrl, and CreatedAt (uses extracted published date or UTC now).
    /// The GitHubUrl is set to the source URL only when it contains "github.com".
    /// </returns>
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

    /// <summary>
    /// Create a slug derived from the provided base value that is unique among projects.
    /// </summary>
    /// <param name="excludeId">Optional project ID to exclude from uniqueness checks (useful when updating that project).</param>
    /// <returns>A slug based on <paramref name="baseSlug"/> that does not conflict with existing project slugs.</returns>
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

    /// <summary>
    /// Determines whether a project slug is already in use.
    /// </summary>
    /// <param name="slug">The slug to check for existence.</param>
    /// <param name="excludeId">Optional project ID to exclude from the check (useful when validating an existing project's slug).</param>
    /// <returns>`true` if the slug exists for a project other than <paramref name="excludeId"/>, `false` otherwise.</returns>
    private async Task<bool> SlugExistsAsync(string slug, Guid? excludeId = null)
    {
        return await _slugExistsQueryHandler.HandleAsync(slug, excludeId);
    }
}


