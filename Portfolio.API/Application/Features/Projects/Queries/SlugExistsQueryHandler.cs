using Microsoft.EntityFrameworkCore;
using Portfolio.API.Repositories;
using Portfolio.API.Entities;

namespace Portfolio.API.Features.Projects.Queries;

public class SlugExistsQueryHandler : BaseQueryHandler
{
    public SlugExistsQueryHandler(IUnitOfWork unitOfWork) : base(unitOfWork)
    {
    }

    public async Task<bool> HandleAsync(string slug, Guid? excludeId = null)
    {
        var query = _unitOfWork.Repository<Project>()
            .Query()
            .Where(p => p.Slug == slug);

        if (excludeId.HasValue)
        {
            query = query.Where(p => p.Id != excludeId.Value);
        }

        return await query.AnyAsync();
    }
}