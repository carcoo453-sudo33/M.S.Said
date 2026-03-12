using System.ComponentModel.DataAnnotations;

namespace Portfolio.API.Entities;

public class Experience : BaseEntity
{
    [Required]
    public string Company { get; set; } = string.Empty;
    public string? Company_Ar { get; set; }
    
    [Required]
    public string Role { get; set; } = string.Empty;
    public string? Role_Ar { get; set; }
    
    [Required]
    public string Duration { get; set; } = string.Empty; // e.g. "2019 - 2021"
    
    public string? Description { get; set; }
    public string? Description_Ar { get; set; }
    
    public string? Location { get; set; }
    public string? Location_Ar { get; set; }
    
    public bool IsCurrent { get; set; } = false;
}
