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

    public async Task<ProjectDto?> HandleAsync(string slug)
    {
        var project = await GetBaseQuery()
            .FirstOrDefaultAsync(p => p.Slug == slug);

        if (project == null)
        {
            return null;
        }

        return ProjectMapper.ToResponse(project);
    }
}


