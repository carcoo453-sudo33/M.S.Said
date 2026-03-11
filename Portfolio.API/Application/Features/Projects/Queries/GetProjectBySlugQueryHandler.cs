using Microsoft.EntityFrameworkCore;
using Portfolio.API.Repositories;
using Portfolio.API.Application.Features.Projects.DTOs;
using Portfolio.API.Application.Features.Projects.Mappers;

namespace Portfolio.API.Application.Features.Projects.Queries;

public class GetProjectBySlugQueryHandler : BaseQueryHandler
{
    public GetProjectBySlugQueryHandler(IUnitOfWork unitOfWork) : base(unitOfWork)
    {
    }

    /// <summary>
    /// Retrieves a project identified by its slug.
    /// </summary>
    /// <param name="slug">The unique slug identifying the project.</param>
    /// <returns>
    /// The <see cref="ProjectDto"/> for the matching project, or <c>null</c> if no project exists with the provided slug.
    /// </returns>
    public async Task<ProjectDto?> HandleAsync(string slug)
    {
        var project = await GetBaseQuery()
            .Include(p => p.KeyFeatures)
            .Include(p => p.Changelog)
            .Include(p => p.Comments)
            .FirstOrDefaultAsync(p => p.Slug == slug, cancellationToken);

        if (project == null)
        {
            return null;
        }

        return ProjectMapper.ToResponse(project);
    }
}


