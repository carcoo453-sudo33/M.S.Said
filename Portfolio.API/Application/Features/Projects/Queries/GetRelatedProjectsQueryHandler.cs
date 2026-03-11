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
    /// </summary>
    /// <param name="slug">The unique slug of the project used to find its category.</param>
    /// <returns>A list of ProjectDto for projects in the same category as the referenced project, excluding the project itself; an empty list if the project is not found.</returns>
    public async Task<List<ProjectDto>> HandleAsync(string slug)
    {
        // First get the project to find its category
        var project = await GetBaseQuery(false)
            .FirstOrDefaultAsync(p => p.Slug == slug);

        if (project == null) return new List<ProjectDto>();

        // Get related projects in the same category
        var relatedProjects = await GetBaseQuery()
            .Where(p => p.Category == project.Category && p.Id != project.Id)
            .OrderBy(p => p.Order)
            .Take(PaginationConstants.RelatedProjectsCount)
            .ToListAsync();

        return relatedProjects.Select(ProjectMapper.ToResponse).ToList();
    }
}


