using Microsoft.EntityFrameworkCore;
using Portfolio.API.Repositories;
using Portfolio.API.Features.Projects.DTOs;
using Portfolio.API.Features.Projects.Mappers;

namespace Portfolio.API.Features.Projects.Queries;

public class GetFeaturedProjectsQueryHandler : BaseQueryHandler
{
    public GetFeaturedProjectsQueryHandler(IUnitOfWork unitOfWork) : base(unitOfWork)
    {
    }

    public async Task<List<ProjectDto>> HandleAsync()
    {
        var projects = await GetBaseQuery()
            .Where(p => p.IsFeatured)
            .OrderBy(p => p.Order)
            .ToListAsync();

        return projects.Select(ProjectMapper.ToResponse).ToList();
    }
}