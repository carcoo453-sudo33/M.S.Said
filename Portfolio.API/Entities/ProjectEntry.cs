using System.ComponentModel.DataAnnotations;

namespace Portfolio.API.Entities;

public class ProjectEntry : BaseEntity
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

    public string? Category { get; set; } // e.g. "Web Development"
    public string? Category_Ar { get; set; }

    public string? Tags { get; set; } // e.g. "UI/UX, Backend"
    public string? Tags_Ar { get; set; }

    public string? Niche { get; set; } // e.g. "E-commerce"
    public string? Niche_Ar { get; set; }

    public string? Company { get; set; } // e.g. "WE3DS", "Remote", "Self Work"
    public string? Company_Ar { get; set; }
    
    public string? ImageUrl { get; set; }
    
    public string? DemoUrl { get; set; }
    
    public string? RepoUrl { get; set; }
    
    public string? Duration { get; set; } // e.g. "2024-2025"
    public string? Duration_Ar { get; set; }
    
    public string? Language { get; set; }
    public string? Language_Ar { get; set; }
    
    public string? Architecture { get; set; }
    public string? Architecture_Ar { get; set; }
    
    public string? Status { get; set; }
    public string? Status_Ar { get; set; }

    public int Order { get; set; }
    
    public bool IsFeatured { get; set; }
    
    public int Views { get; set; }

    public int ReactionsCount { get; set; }

    // JSON properties for simple lists (or can be configured in DbContext)
    public string? GalleryJson { get; set; }
    public string? ResponsibilitiesJson { get; set; }

    // Navigation Properties
    public virtual ICollection<ProjectKeyFeature> KeyFeatures { get; set; } = new List<ProjectKeyFeature>();
    public virtual ICollection<ProjectChangelogItem> Changelog { get; set; } = new List<ProjectChangelogItem>();
    public virtual ICollection<ProjectComment> Comments { get; set; } = new List<ProjectComment>();
}
