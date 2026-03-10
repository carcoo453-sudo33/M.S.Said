using System.ComponentModel.DataAnnotations;
using Portfolio.API.Domain.Enums;

namespace Portfolio.API.Entities;

public class Project : BaseEntity
{
    [Required]
    public string Title { get; set; } = string.Empty;
    public string? Title_Ar { get; set; }

    [Required]
    public string Slug { get; set; } = string.Empty;
    
    public string? Description { get; set; }
    public string? Description_Ar { get; set; }
    
    public string? Summary { get; set; }
    public string? Summary_Ar { get; set; }
    
    public string? TechStack { get; set; } // e.g. "Angular, .NET, SQL"

    public ProjectCategory? Category { get; set; }
    public string? Category_Ar { get; set; }

    public string? Niche { get; set; } // e.g. "E-commerce"
    public string? Niche_Ar { get; set; }

    public string? Company { get; set; } // e.g. "WE3DS", "Remote", "Self Work"
    public string? Company_Ar { get; set; }
    
    public string? ImageUrl { get; set; }
    
    public string? DemoUrl { get; set; }
    
    public string? RepoUrl { get; set; }
    
    public string? Duration { get; set; } // e.g. "2024-2025"
    public string? Duration_Ar { get; set; }
    
    public ProgrammingLanguage? Language { get; set; }
    public string? Language_Ar { get; set; }
    
    public ArchitectureType? Architecture { get; set; }
    public string? Architecture_Ar { get; set; }
    
    public ProjectStatus? Status { get; set; }
    public string? Status_Ar { get; set; }

    public ProjectType? Type { get; set; } = ProjectType.Initial;
    public string? Type_Ar { get; set; }

    public DevelopmentMethod? DevelopmentMethod { get; set; } = Enums.DevelopmentMethod.Manual;
    public string? DevelopmentMethod_Ar { get; set; }

    public int Order { get; set; }
    
    public bool IsFeatured { get; set; }
    
    public int Views { get; set; }

    public int ReactionsCount { get; set; }

    // JSON properties for simple lists (or can be configured in DbContext)
    public string? ResponsibilitiesJson { get; set; }

    // Navigation Properties
    public virtual ICollection<ProjectImage> Images { get; set; } = new List<ProjectImage>();
    public virtual ICollection<KeyFeature> KeyFeatures { get; set; } = new List<KeyFeature>();
    public virtual ICollection<ChangelogItem> Changelog { get; set; } = new List<ChangelogItem>();
    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public virtual ICollection<Reaction> Reactions { get; set; } = new List<Reaction>();
    public virtual Seo? Seo { get; set; }
}

