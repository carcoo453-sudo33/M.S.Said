using System.Text.Json.Serialization;

namespace Portfolio.API.Application.Features.Bio.DTOs;

public class BioDto
{
    [JsonRequired]
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Name_Ar { get; set; }
    public string? Title { get; set; }
    public string? Title_Ar { get; set; }
    public string? Description { get; set; }
    public string? Description_Ar { get; set; }
    public string? Location { get; set; }
    public string? Location_Ar { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
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
    public DateTime CareerStartDate { get; set; }
    public string? GitHubUsername { get; set; }
    public string? YearsOfExperience { get; set; }
    public string? ProjectsCompleted { get; set; }
    public string? CodeCommits { get; set; }
    public string? EducationQuote { get; set; }
    public string? EducationQuote_Ar { get; set; }
    
    // Nested DTOs
    public SignatureDto? Signature { get; set; }
    public TechnicalFocusDto? TechnicalFocus { get; set; }
}



