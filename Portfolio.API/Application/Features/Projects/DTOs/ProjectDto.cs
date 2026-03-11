using Portfolio.API.Domain.Enums;

namespace Portfolio.API.Application.Features.Projects.DTOs;

public class ProjectDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Title_Ar { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Description_Ar { get; set; }
    public string? Summary { get; set; }
    public string? Summary_Ar { get; set; }
    public string? ImageUrl { get; set; }
    public string? ProjectUrl { get; set; }
    public string? GitHubUrl { get; set; }
    public ProjectCategory? Category { get; set; }
    public string? Category_Ar { get; set; }
    public string? TechStack { get; set; }
    public string? Niche { get; set; }
    public string? Niche_Ar { get; set; }
    public string? Company { get; set; }
    public string? Company_Ar { get; set; }
    public string? Duration { get; set; }
    public string? Duration_Ar { get; set; }
    public ProgrammingLanguage? Language { get; set; }
    public string? Language_Ar { get; set; }
    public ArchitectureType? Architecture { get; set; }
    public string? Architecture_Ar { get; set; }
    public ProjectStatus? Status { get; set; }
    public string? Status_Ar { get; set; }
    public ProjectType? Type { get; set; }
    public string? Type_Ar { get; set; }
    public DevelopmentMethod? DevelopmentMethod { get; set; }
    public string? DevelopmentMethod_Ar { get; set; }
    public int Order { get; set; }
    public bool IsFeatured { get; set; }
    public int Views { get; set; }
    public int ReactionsCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<ProjectImageDto> Images { get; set; } = new();
    public List<ResponsibilityDto> Responsibilities { get; set; } = new();
    public List<KeyFeatureDto> KeyFeatures { get; set; } = new();
    public List<ChangelogItemDto> Changelog { get; set; } = new();
}



