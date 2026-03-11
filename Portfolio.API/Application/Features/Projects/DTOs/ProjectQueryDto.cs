namespace Portfolio.API.Features.Projects.DTOs;

public class ProjectQueryDto
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? Category { get; set; }
    public bool? IsFeatured { get; set; }
    public string? Search { get; set; }
    public string? SortBy { get; set; } = "Order";
    public string? SortDirection { get; set; } = "asc";
}