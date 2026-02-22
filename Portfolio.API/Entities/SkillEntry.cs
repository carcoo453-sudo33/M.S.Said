using System.ComponentModel.DataAnnotations;

namespace Portfolio.API.Entities;

public class SkillEntry : BaseEntity
{
    [Required]
    public string Name { get; set; } = string.Empty; // e.g. "Angular"
    
    public string? Icon { get; set; } // lucide icon name or image url
    
    public int Order { get; set; }
}
