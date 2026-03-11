using Microsoft.EntityFrameworkCore;
using Portfolio.API.Repositories;
using Portfolio.API.Entities;

namespace Portfolio.API.Application.Features.Projects.Queries;

public abstract class BaseQueryHandler
{
    protected readonly IUnitOfWork _unitOfWork;

    protected BaseQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Builds a base query for Project entities with optional eager-loaded related collections.
    /// </summary>
    /// <param name="includeRelations">If true, includes the KeyFeatures, Changelog, and Comments navigation collections in the query; if false, returns the query without those includes.</param>
    /// <returns>An IQueryable&lt;Project&gt; representing the base project query; includes related KeyFeatures, Changelog, and Comments when <paramref name="includeRelations"/> is true.</returns>
    protected IQueryable<Project> GetBaseQuery(bool includeRelations = true)
    {
        var query = _unitOfWork.Repository<Project>()
            .Query()
            .AsNoTracking();

        if (includeRelations)
        {
            query = query
                .Include(p => p.KeyFeatures)
                .Include(p => p.Changelog)
                .Include(p => p.Comments);
        }

        return query;
    }
}


