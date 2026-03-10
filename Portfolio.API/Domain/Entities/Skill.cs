using System.ComponentModel.DataAnnotations;

namespace Portfolio.API.Entities;

public class Skill : BaseEntity
{
    [Required]
    public string Name { get; set; } = string.Empty; // e.g. "Angular" - shown as tooltip on hover
    
    public string? IconPath { get; set; } // Local upload path for skill icon/image
    
    public int Order { get; set; }
}
