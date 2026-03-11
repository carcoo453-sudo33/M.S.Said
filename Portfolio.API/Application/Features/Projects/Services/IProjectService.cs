using Portfolio.API.Application.Features.Projects.DTOs;
using Portfolio.API.Application.Common;

namespace Portfolio.API.Application.Features.Projects.Services;

public interface IProjectService
{
    Task<PagedResult<ProjectDto>> GetProjectsAsync(ProjectQueryDto parameters);
    Task<ProjectDto?> GetProjectBySlugAsync(string slug);
    /// <summary>
/// Retrieves projects that are marked as featured.
/// </summary>
/// <returns>A list of ProjectDto objects representing featured projects; an empty list if none are available.</returns>
Task<List<ProjectDto>> GetFeaturedProjectsAsync();
    /// <summary>
/// Retrieves projects that are related to the project identified by the given slug.
/// </summary>
/// <param name="slug">The slug identifying the source project used to find related projects.</param>
/// <returns>A list of <see cref="ProjectDto"/> instances representing projects related to the specified project.</returns>
Task<List<ProjectDto>> GetRelatedProjectsAsync(string slug);
    /// <summary>
/// Creates a new project using the provided creation data.
/// </summary>
/// <param name="request">Data required to create the project (title, description, metadata, assets, and other creation fields).</param>
/// <returns>The created project represented as a <see cref="ProjectDto"/>.</returns>
Task<ProjectDto> CreateProjectAsync(ProjectCreateDto request);
    /// <summary>
/// Updates the project with the specified identifier using the provided update data.
/// </summary>
/// <param name="id">The identifier of the project to update.</param>
/// <param name="request">The data to apply to the project.</param>
/// <returns>The updated ProjectDto if the project was found and updated; otherwise, null.</returns>
Task<ProjectDto?> UpdateProjectAsync(Guid id, ProjectUpdateDto request);
    /// <summary>
/// Deletes the project identified by the specified id.
/// </summary>
/// <param name="id">The unique identifier of the project to delete.</param>
/// <returns>`true` if the project was deleted, `false` otherwise.</returns>
Task<bool> DeleteProjectAsync(Guid id);
    /// <summary>
/// Imports a project from the specified external URL and returns the created project.
/// </summary>
/// <param name="request">The import request containing the source URL and any import options.</param>
/// <returns>The imported project as a <see cref="ProjectDto"/>.</returns>
Task<ProjectDto> ImportFromUrlAsync(ImportRequest request);
}


