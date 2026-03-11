using System.ComponentModel.DataAnnotations;

namespace Portfolio.API.Entities;

public class Skill : BaseEntity
{
    [Required]
    public string Name { get; set; } = string.Empty; // e.g. "Angular"
    
    public string? Name_Ar { get; set; } // Arabic translation
    
    public string? Icon { get; set; } // image url only (no longer supports lucide icon names)
    
    public int Order { get; set; }
}
