using Portfolio.API.Application.Features.Projects.DTOs;
using Portfolio.API.Application.Common;

namespace Portfolio.API.Application.Features.Projects.Services;

public interface IProjectService
{
    /// <summary>
    /// Retrieves a paged list of projects based on the provided query parameters.
    /// </summary>
    /// <param name="parameters">The query parameters for filtering, searching, and pagination.</param>
    /// <param name="cancellationToken">Token to cancel the request.</param>
    /// <returns>A paged result containing the list of matching project DTOs.</returns>
    Task<PagedResult<ProjectDto>> GetProjectsAsync(ProjectQueryDto parameters, CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves the project identified by the given slug.
    /// </summary>
    /// <param name="slug">The unique URL-friendly identifier of the project.</param>
    /// <param name="cancellationToken">Token to cancel the request.</param>
    /// <returns>ProjectDto for the matching project, or null if not found.</returns>
    Task<ProjectDto?> GetProjectBySlugAsync(string slug, CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves a list of featured projects for the portfolio homepage.
    /// </summary>
    /// <param name="cancellationToken">Token to cancel the request.</param>
    /// <returns>A list of featured project DTOs.</returns>
    Task<List<ProjectDto>> GetFeaturedProjectsAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves projects that are related to the project identified by the given slug.
    /// </summary>
    /// <param name="slug">The slug identifying the source project used to find related projects.</param>
    /// <param name="cancellationToken">Token to cancel the request.</param>
    /// <returns>A list of ProjectDto representing related projects.</returns>
    Task<List<ProjectDto>> GetRelatedProjectsAsync(string slug, CancellationToken cancellationToken = default);

    /// <summary>
    /// Creates a new project from the provided creation data.
    /// </summary>
    /// <param name="request">The project creation DTO.</param>
    /// <param name="cancellationToken">Token to cancel the request.</param>
    /// <returns>The created project's DTO.</returns>
    Task<ProjectDto> CreateProjectAsync(ProjectCreateDto request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates an existing project with values from the provided request.
    /// </summary>
    /// <param name="id">The identifier of the project to update.</param>
    /// <param name="request">The updated project data.</param>
    /// <param name="cancellationToken">Token to cancel the request.</param>
    /// <returns>The updated ProjectDto if found; otherwise, null.</returns>
    Task<ProjectDto?> UpdateProjectAsync(Guid id, ProjectUpdateDto request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Deletes a project and its associated data from the database.
    /// </summary>
    /// <param name="id">The unique identifier of the project to delete.</param>
    /// <param name="cancellationToken">Token to cancel the request.</param>
    /// <returns>True if the project was successfully deleted; otherwise, false.</returns>
    Task<bool> DeleteProjectAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Scrapes metadata from a given URL to facilitate project import.
    /// </summary>
    /// <param name="request">The import request containing the target URL.</param>
    /// <param name="cancellationToken">Token to cancel the request.</param>
    /// <returns>A populated ProjectDto if metadata extraction was successful; otherwise, null.</returns>
    Task<ProjectDto> ImportFromUrlAsync(ImportRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Increments the view count for the project identified by the given slug.
    /// </summary>
    /// <param name="slug">The unique slug identifier of the project.</param>
    /// <param name="cancellationToken">Token to cancel the request.</param>
    /// <returns>True if the view count was successfully incremented; otherwise, false.</returns>
    Task<bool> TrackProjectViewAsync(string slug, CancellationToken cancellationToken = default);
}


