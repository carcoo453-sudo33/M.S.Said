using System;

namespace Portfolio.API.DTOs;

public class BioDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string? LinkedInUrl { get; set; }
    public string? GitHubUrl { get; set; }
    public string? WhatsAppUrl { get; set; }
    public string? CVUrl { get; set; }
    public string? TwitterUrl { get; set; }
    public string YearsOfExperience { get; set; } = string.Empty;
    public string ProjectsCompleted { get; set; } = string.Empty;
    public string CodeCommits { get; set; } = string.Empty;
    public string? EducationQuote { get; set; }
    public string? TechnicalFocusTitle { get; set; }
    public string? TechnicalFocusDescription { get; set; }
    public string? TechnicalFocusItems { get; set; }
}
