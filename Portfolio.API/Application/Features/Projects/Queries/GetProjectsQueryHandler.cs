using Microsoft.EntityFrameworkCore;
using Portfolio.API.Repositories;
using Portfolio.API.Features.Projects.DTOs;
using Portfolio.API.Features.Projects.Mappers;
using Portfolio.API.DTOs;
using Portfolio.API.Enums;

namespace Portfolio.API.Features.Projects.Queries;

public class GetProjectsQueryHandler : BaseQueryHandler
{
    public GetProjectsQueryHandler(IUnitOfWork unitOfWork) : base(unitOfWork)
    {
    }

    public async Task<PagedResult<ProjectDto>> HandleAsync(ProjectQueryDto parameters)
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

        var totalCount = await query.CountAsync();
        var projects = await query
            .Skip((parameters.Page - 1) * parameters.PageSize)
            .Take(parameters.PageSize)
            .ToListAsync();

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