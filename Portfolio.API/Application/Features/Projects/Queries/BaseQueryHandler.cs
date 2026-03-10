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


