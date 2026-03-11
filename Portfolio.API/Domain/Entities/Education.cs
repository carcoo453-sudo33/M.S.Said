using System;
using Portfolio.API.Enums;

namespace Portfolio.API.Entities;

public class Education : BaseEntity
{
    public string Institution { get; set; } = string.Empty;
    public string? Institution_Ar { get; set; }
    
    public string Degree { get; set; } = string.Empty;
    public string? Degree_Ar { get; set; }
    
    public string Duration { get; set; } = string.Empty;
    
    public string? Description { get; set; }
    public string? Description_Ar { get; set; }
    
    public string? Location { get; set; }
    public string? Location_Ar { get; set; }
    
    public string? ImageUrl { get; set; }
    
    public bool IsCompleted { get; set; } = true;
    public EducationCategory Category { get; set; } = EducationCategory.Education;
}
