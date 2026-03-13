using Portfolio.API.Domain.Enums;

namespace Portfolio.API.Application.Features.Projects.DTOs;

public class ProjectDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Title_Ar { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Description_Ar { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public string Summary_Ar { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string ProjectUrl { get; set; } = string.Empty;
    public string GitHubUrl { get; set; } = string.Empty;
    public ProjectCategory? Category { get; set; }
    public string Category_Ar { get; set; } = string.Empty;
    public string TechStack { get; set; } = string.Empty;
    public string Niche { get; set; } = string.Empty;
    public string Niche_Ar { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string Company_Ar { get; set; } = string.Empty;
    public string Duration { get; set; } = string.Empty;
    public string Duration_Ar { get; set; } = string.Empty;
    public ProgrammingLanguage? Language { get; set; }
    public string Language_Ar { get; set; } = string.Empty;
    public ArchitectureType? Architecture { get; set; }
    public string Architecture_Ar { get; set; } = string.Empty;
    public ProjectStatus? Status { get; set; }
    public string Status_Ar { get; set; } = string.Empty;
    public ProjectType? Type { get; set; }
    public string Type_Ar { get; set; } = string.Empty;
    public DevelopmentMethod? DevelopmentMethod { get; set; }
    public string DevelopmentMethod_Ar { get; set; } = string.Empty;
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



