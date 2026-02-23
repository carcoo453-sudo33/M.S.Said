using System.ComponentModel.DataAnnotations;

namespace Portfolio.API.Entities;

public class ProjectEntry : BaseEntity
{
    [Required]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Slug { get; set; } = string.Empty;
    
    public string? Description { get; set; }
    
    public string? TechStack { get; set; } // e.g. "Angular, .NET, SQL"

    public string? Category { get; set; } // e.g. "Web Development"

    public string? Tags { get; set; } // e.g. "UI/UX, Backend"

    public string? Niche { get; set; } // e.g. "E-commerce"
    
    public string? ImageUrl { get; set; }
    
    public string? DemoUrl { get; set; }
    
    public string? RepoUrl { get; set; }
    
    public string? Duration { get; set; } // e.g. "2024-2025"
}
