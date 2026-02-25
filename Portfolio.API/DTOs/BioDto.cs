using System;

namespace Portfolio.API.DTOs;

public class BioDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Name_Ar { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Title_Ar { get; set; }
    public string Description { get; set; } = string.Empty;
    public string? Description_Ar { get; set; }
    public string Location { get; set; } = string.Empty;
    public string? Location_Ar { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string? LinkedInUrl { get; set; }
    public string? GitHubUrl { get; set; }
    public string? WhatsAppUrl { get; set; }
    public string? CVUrl { get; set; }
    public string? TwitterUrl { get; set; }
    public string? FacebookUrl { get; set; }
    public string? DevToUrl { get; set; }
    public string? PinterestUrl { get; set; }
    public string? StackOverflowUrl { get; set; }
    public string YearsOfExperience { get; set; } = string.Empty;
    public string ProjectsCompleted { get; set; } = string.Empty;
    public string CodeCommits { get; set; } = string.Empty;
    public string? EducationQuote { get; set; }
    public string? EducationQuote_Ar { get; set; }
    public string? SignatureRole { get; set; }
    public string? SignatureRole_Ar { get; set; }
    public string? SignatureName { get; set; }
    public string? SignatureName_Ar { get; set; }
    public string? SignatureSubtitle { get; set; }
    public string? SignatureSubtitle_Ar { get; set; }
    public string? SignatureVerifiedText { get; set; }
    public string? SignatureVerifiedText_Ar { get; set; }
    public string? TechnicalFocusTitle { get; set; }
    public string? TechnicalFocusTitle_Ar { get; set; }
    public string? TechnicalFocusDescription { get; set; }
    public string? TechnicalFocusDescription_Ar { get; set; }
    public string? TechnicalFocusItems { get; set; }
    public string? TechnicalFocusItems_Ar { get; set; }
}
