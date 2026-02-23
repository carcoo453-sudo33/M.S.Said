using System;

namespace Portfolio.API.DTOs;

public class ExperienceDto
{
    public Guid Id { get; set; }
    public string Role { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string Duration { get; set; } = string.Empty; // e.g., "Oct 2021 - Present"
    public string Description { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public bool IsCurrent { get; set; }
}
