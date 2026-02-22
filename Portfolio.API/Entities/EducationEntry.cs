using System;

namespace Portfolio.API.Entities;

public class EducationEntry : BaseEntity
{
    public string Institution { get; set; } = string.Empty;
    public string Degree { get; set; } = string.Empty;
    public string Duration { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Location { get; set; }
    public bool IsCompleted { get; set; } = true;
}
