using System.ComponentModel.DataAnnotations;

namespace Portfolio.API.Entities;

public class ProjectEntry : BaseEntity
{
    [Required]
    public string Title { get; set; } = string.Empty;
    
    public string? Description { get; set; }
    
    public string? TechStack { get; set; } // e.g. "Angular, .NET, SQL"
    
    public string? ImageUrl { get; set; }
    
    public string? DemoUrl { get; set; }
    
    public string? RepoUrl { get; set; }
}
