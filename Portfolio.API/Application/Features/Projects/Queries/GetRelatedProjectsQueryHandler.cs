using Microsoft.EntityFrameworkCore;
using Portfolio.API.Repositories;
using Portfolio.API.Application.Features.Projects.DTOs;
using Portfolio.API.Application.Features.Projects.Mappers;
using Portfolio.API.Constants;

namespace Portfolio.API.Application.Features.Projects.Queries;

public class GetRelatedProjectsQueryHandler : BaseQueryHandler
{
    public GetRelatedProjectsQueryHandler(IUnitOfWork unitOfWork) : base(unitOfWork)
    {
    }

    /// <summary>
    /// Retrieve projects related to the project identified by the given slug.
    /// Optimized to use a single query instead of two separate database calls.
    /// </summary>
    /// <param name="slug">The unique slug of the project used to find its category.</param>
    /// <param name="cancellationToken">Token to cancel the operation.</param>
    /// <returns>A list of ProjectDto for projects in the same category as the referenced project, excluding the project itself; an empty list if the project is not found.</returns>
    public async Task<List<ProjectDto>> HandleAsync(string slug, CancellationToken cancellationToken = default)
    {
        // Get the category of the target project and related projects in a single query
        var targetProject = await GetBaseQuery(false)
            .Where(p => p.Slug == slug)
            .Select(p => p.Category)
            .FirstOrDefaultAsync(cancellationToken);

        // If project not found, return empty list
        if (targetProject == null) return new List<ProjectDto>();

        // Get related projects in the same category (single query)
        var relatedProjects = await GetBaseQuery()
            .Where(p => p.Category == targetProject && p.Slug != slug)
            .OrderBy(p => p.Order)
            .Take(PaginationConstants.RelatedProjectsCount)
            .ToListAsync(cancellationToken);

        return relatedProjects.Select(ProjectMapper.ToResponse).ToList();
    }
}


