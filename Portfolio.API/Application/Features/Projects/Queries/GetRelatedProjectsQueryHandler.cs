using Microsoft.EntityFrameworkCore;
using Portfolio.API.Repositories;
using Portfolio.API.Features.Projects.DTOs;
using Portfolio.API.Features.Projects.Mappers;
using Portfolio.API.Constants;

namespace Portfolio.API.Features.Projects.Queries;

public class GetRelatedProjectsQueryHandler : BaseQueryHandler
{
    public GetRelatedProjectsQueryHandler(IUnitOfWork unitOfWork) : base(unitOfWork)
    {
    }

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