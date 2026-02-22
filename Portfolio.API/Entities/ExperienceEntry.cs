using System.ComponentModel.DataAnnotations;

namespace Portfolio.API.Entities;

public class ExperienceEntry : BaseEntity
{
    [Required]
    public string Company { get; set; } = string.Empty;
    
    [Required]
    public string Role { get; set; } = string.Empty;
    
    [Required]
    public string Duration { get; set; } = string.Empty; // e.g. "Jan 2021 - Present"
    
    public string? Description { get; set; }
    
    public string? Location { get; set; }
    
    public bool IsCurrent { get; set; }
}
