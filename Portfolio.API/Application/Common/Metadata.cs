namespace Portfolio.API.Application.Common;

/// <summary>
/// Generic metadata DTO for extracting content from URLs
/// Can be used for blog posts, projects, or any content import
/// </summary>
public class Metadata
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Content { get; set; }
    public string? ImageUrl { get; set; }
    public string? Author { get; set; }
    public DateTime? PublishedDate { get; set; }
    public string? Tags { get; set; }
    public string? Category { get; set; }
    public string? Niche { get; set; }
    public string? PlatformType { get; set; }

    // Enhanced metadata for projects
    public List<Portfolio.API.Application.Features.Projects.DTOs.KeyFeatureCreateDto> KeyFeatures { get; set; } = new();
    public List<Portfolio.API.Application.Features.Projects.DTOs.ResponsibilityCreateDto> Responsibilities { get; set; } = new();
    public List<Portfolio.API.Application.Features.Projects.DTOs.ChangelogItemCreateDto> Changelog { get; set; } = new();
}
