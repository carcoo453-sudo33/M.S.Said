using Portfolio.API.Repositories;
using Microsoft.EntityFrameworkCore;
using Portfolio.API.Application.Features.Projects.DTOs;
using Portfolio.API.Application.Features.Projects.Mappers;
using Portfolio.API.Application.Common;
using Portfolio.API.Domain.Enums;

namespace Portfolio.API.Application.Features.Projects.Queries;

public class GetProjectsQueryHandler : BaseQueryHandler
{
    public GetProjectsQueryHandler(IUnitOfWork unitOfWork) : base(unitOfWork)
    {
    }

<<<<<<< HEAD
    public async Task<PagedResult<ProjectDto>> HandleAsync(ProjectQueryDto parameters, CancellationToken cancellationToken = default)
=======
    /// <summary>
    /// Retrieves a paged list of projects using the provided query parameters, applying category, featured, and search filters, sorting, and pagination.
    /// </summary>
    /// <param name="parameters">Query and pagination options (Category, IsFeatured, Search, SortBy, SortDirection, Page, PageSize).</param>
    /// <returns>A PagedResult&lt;ProjectDto&gt; containing the mapped project items, the total item count, current page, page size, and total pages.</returns>
    public async Task<PagedResult<ProjectDto>> HandleAsync(ProjectQueryDto parameters)
>>>>>>> origin/master
    {
        var query = GetBaseQuery();

        // Apply filters
        if (!string.IsNullOrEmpty(parameters.Category))
        {
            // Convert string to ProjectCategory enum for comparison
            if (Enum.TryParse<ProjectCategory>(parameters.Category, out var category))
            {
                query = query.Where(p => p.Category == category);
            }
            else
            {
                // Return empty result for invalid category rather than ignoring filter
                query = query.Where(p => false);
            }
        }
        if (parameters.IsFeatured.HasValue)
            query = query.Where(p => p.IsFeatured == parameters.IsFeatured.Value);

        if (!string.IsNullOrEmpty(parameters.Search))
        {
            query = query.Where(p => 
                p.Title.Contains(parameters.Search) ||
                p.Description!.Contains(parameters.Search) ||
                p.TechStack!.Contains(parameters.Search));
        }

        // Apply sorting
        query = parameters.SortBy?.ToLower() switch
        {
            "title" => parameters.SortDirection == "desc" 
                ? query.OrderByDescending(p => p.Title)
                : query.OrderBy(p => p.Title),
            "createdat" => parameters.SortDirection == "desc"
                ? query.OrderByDescending(p => p.CreatedAt)
                : query.OrderBy(p => p.CreatedAt),
            "views" => parameters.SortDirection == "desc"
                ? query.OrderByDescending(p => p.Views)
                : query.OrderBy(p => p.Views),
            _ => query.OrderBy(p => p.Order)
        };

        var totalCount = await query.CountAsync(cancellationToken);
        var projects = await query
            .Skip((parameters.Page - 1) * parameters.PageSize)
            .Take(parameters.PageSize)
            .ToListAsync(cancellationToken);

        return new PagedResult<ProjectDto>
        {
            Items = projects.Select(ProjectMapper.ToResponse).ToList(),
            TotalCount = totalCount,
            Page = parameters.Page,
            PageSize = parameters.PageSize,
            TotalPages = (int)Math.Ceiling((double)totalCount / parameters.PageSize)
        };
    }
}



