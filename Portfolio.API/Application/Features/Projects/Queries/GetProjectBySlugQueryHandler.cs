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

    public async Task<ProjectDto?> HandleAsync(string slug, CancellationToken cancellationToken = default)
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