using System;

namespace Portfolio.API.DTOs;

public class ExperienceDto
{
    public Guid Id { get; set; }
    public string Role { get; set; } = string.Empty;
    public string? Role_Ar { get; set; }
    public string Company { get; set; } = string.Empty;
    public string? Company_Ar { get; set; }
    public string Duration { get; set; } = string.Empty; // e.g., "Oct 2021 - Present"
    public string Description { get; set; } = string.Empty;
    public string? Description_Ar { get; set; }
    public string Location { get; set; } = string.Empty;
    public string? Location_Ar { get; set; }
    public bool IsCurrent { get; set; }
}
