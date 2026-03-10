using Portfolio.API.Features.Projects.DTOs;
using Portfolio.API.DTOs;

namespace Portfolio.API.Features.Projects.Services;

public interface IProjectService
{
    Task<PagedResult<ProjectDto>> GetProjectsAsync(ProjectQueryDto parameters);
    Task<ProjectDto?> GetProjectBySlugAsync(string slug);
    Task<List<ProjectDto>> GetFeaturedProjectsAsync();
    Task<List<ProjectDto>> GetRelatedProjectsAsync(string slug);
    Task<ProjectDto> CreateProjectAsync(ProjectCreateDto request);
    Task<ProjectDto> UpdateProjectAsync(Guid id, ProjectUpdateDto request);
    Task DeleteProjectAsync(Guid id);
    Task<ProjectDto> ImportFromGitHubAsync(Guid projectId, string githubUrl);
    Task<int> ReactToProjectAsync(Guid projectId);
}