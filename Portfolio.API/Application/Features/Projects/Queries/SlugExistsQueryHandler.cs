using Microsoft.EntityFrameworkCore;
using Portfolio.API.Repositories;
using Portfolio.API.Entities;

namespace Portfolio.API.Application.Features.Projects.Queries;

public class SlugExistsQueryHandler : BaseQueryHandler
{
    public SlugExistsQueryHandler(IUnitOfWork unitOfWork) : base(unitOfWork)
    {
    }

    /// <summary>
    /// Determines whether a Project with the specified slug exists, optionally excluding a given project id.
    /// </summary>
    /// <param name="slug">The project slug to search for.</param>
    /// <param name="excludeId">An optional project Id to exclude from the check; when null no exclusion is applied.</param>
    /// <returns>`true` if a matching Project exists, `false` otherwise.</returns>
    public async Task<bool> HandleAsync(string slug, Guid? excludeId = null, CancellationToken cancellationToken = default)

    {
        var query = _unitOfWork.Repository<Project>()
            .Query()
            .Where(p => p.Slug == slug);

        if (excludeId.HasValue)
        {
            query = query.Where(p => p.Id != excludeId.Value);
        }

        return await query.AnyAsync(cancellationToken);
    }
}


