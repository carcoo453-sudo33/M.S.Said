using Microsoft.EntityFrameworkCore;
using Portfolio.API.Repositories;
using Portfolio.API.Application.Features.Projects.DTOs;
using Portfolio.API.Application.Features.Projects.Mappers;

namespace Portfolio.API.Application.Features.Projects.Queries;

public class GetFeaturedProjectsQueryHandler : BaseQueryHandler
{
    public GetFeaturedProjectsQueryHandler(IUnitOfWork unitOfWork) : base(unitOfWork)
    {
    }

    /// <summary>
    /// Retrieve featured projects ordered by their Order and map each to a ProjectDto.
    /// </summary>
    /// <returns>A list of ProjectDto representing featured projects ordered by the project's Order value.</returns>
    public async Task<List<ProjectDto>> HandleAsync()
    {
        var projects = await GetBaseQuery()
            .Where(p => p.IsFeatured)
            .OrderBy(p => p.Order)
            .ToListAsync();

        return projects.Select(ProjectMapper.ToResponse).ToList();
    }
}


