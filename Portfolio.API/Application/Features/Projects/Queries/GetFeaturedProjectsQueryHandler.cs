using Microsoft.EntityFrameworkCore;
using Portfolio.API.Repositories;
using Portfolio.API.Application.Features.Projects.DTOs;
using Portfolio.API.Application.Features.Projects.Mappers;
<<<<<<< HEAD

namespace Portfolio.API.Application.Features.Projects.Queries;

=======

namespace Portfolio.API.Application.Features.Projects.Queries;
>>>>>>> origin/master

public class GetFeaturedProjectsQueryHandler : BaseQueryHandler
{
    public GetFeaturedProjectsQueryHandler(IUnitOfWork unitOfWork) : base(unitOfWork)
    {
    }

<<<<<<< HEAD
    public async Task<List<ProjectDto>> HandleAsync(CancellationToken cancellationToken = default)
=======
    /// <summary>
    /// Retrieve featured projects ordered by their Order and map each to a ProjectDto.
    /// </summary>
    /// <returns>A list of ProjectDto representing featured projects ordered by the project's Order value.</returns>
    public async Task<List<ProjectDto>> HandleAsync()
>>>>>>> origin/master
    {
        var projects = await GetBaseQuery()
            .Where(p => p.IsFeatured)
            .OrderBy(p => p.Order)
            .Take(6)
            .ToListAsync(cancellationToken);

        return projects.Select(ProjectMapper.ToResponse).ToList();
    }
}
<<<<<<< HEAD
=======


>>>>>>> origin/master
