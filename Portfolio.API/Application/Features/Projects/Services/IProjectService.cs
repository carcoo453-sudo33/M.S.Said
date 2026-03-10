using Portfolio.API.Application.Features.Projects.DTOs;
using Portfolio.API.Application.Common;

namespace Portfolio.API.Application.Features.Projects.Services;

public interface IProjectService
{
    Task<PagedResult<ProjectDto>> GetProjectsAsync(ProjectQueryDto parameters, CancellationToken cancellationToken = default);
    Task<ProjectDto?> GetProjectBySlugAsync(string slug, CancellationToken cancellationToken = default);
    Task<bool> TrackProjectViewAsync(string slug, CancellationToken cancellationToken = default);
    Task<List<ProjectDto>> GetFeaturedProjectsAsync(CancellationToken cancellationToken = default);
    Task<List<ProjectDto>> GetRelatedProjectsAsync(string slug, CancellationToken cancellationToken = default);
    Task<ProjectDto> CreateProjectAsync(ProjectCreateDto request, CancellationToken cancellationToken = default);
    Task<ProjectDto?> UpdateProjectAsync(Guid id, ProjectUpdateDto request, CancellationToken cancellationToken = default);
    Task<bool> DeleteProjectAsync(Guid id, CancellationToken cancellationToken = default);
    Task<ProjectDto> ImportFromUrlAsync(ImportRequest request, CancellationToken cancellationToken = default);
}


