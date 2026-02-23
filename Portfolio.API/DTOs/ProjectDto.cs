using System;

namespace Portfolio.API.DTOs;

public class ProjectDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public string? ProjectUrl { get; set; }
    public string? GitHubUrl { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Technologies { get; set; } = string.Empty;
    public int Order { get; set; }
    public bool IsFeatured { get; set; }
}
