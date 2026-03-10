using Portfolio.API.Application.Features.Projects.DTOs;
using Portfolio.API.Application.Common;

namespace Portfolio.API.Application.Features.Projects.Services;

public interface IProjectService
{
    Task<PagedResult<ProjectDto>> GetProjectsAsync(ProjectQueryDto parameters);
    Task<ProjectDto?> GetProjectBySlugAsync(string slug);
    Task<List<ProjectDto>> GetFeaturedProjectsAsync();
    Task<List<ProjectDto>> GetRelatedProjectsAsync(string slug);
    Task<ProjectDto> CreateProjectAsync(ProjectCreateDto request);
    Task<ProjectDto?> UpdateProjectAsync(Guid id, ProjectUpdateDto request);
    Task<bool> DeleteProjectAsync(Guid id);
    Task<ProjectDto?> ImportFromGitHubAsync(Guid projectId, string githubUrl);
}


