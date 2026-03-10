using Portfolio.API.Domain.Enums;

namespace Portfolio.API.Application.Features.Education.DTOs;

public class EducationDto
{
    public Guid Id { get; set; }
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
    public string Category { get; set; } = EducationCategory.Education.ToString();
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}



