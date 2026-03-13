using System.Text.Json.Serialization;

namespace Portfolio.API.Application.Features.Bio.DTOs;

public class BioDto
{
    [JsonRequired]
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Name_Ar { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Title_Ar { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Description_Ar { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Location_Ar { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
    public string LinkedInUrl { get; set; } = string.Empty;
    public string GitHubUrl { get; set; } = string.Empty;
    public string WhatsAppUrl { get; set; } = string.Empty;
    public string CVUrl { get; set; } = string.Empty;
    public string TwitterUrl { get; set; } = string.Empty;
    public string FacebookUrl { get; set; } = string.Empty;
    public string DevToUrl { get; set; } = string.Empty;
    public string PinterestUrl { get; set; } = string.Empty;
    public string StackOverflowUrl { get; set; } = string.Empty;
    public DateTime CareerStartDate { get; set; }
    public string GitHubUsername { get; set; } = string.Empty;
    public string YearsOfExperience { get; set; } = string.Empty;
    public string ProjectsCompleted { get; set; } = string.Empty;
    public string CodeCommits { get; set; } = string.Empty;
    public string EducationQuote { get; set; } = string.Empty;
    public string EducationQuote_Ar { get; set; } = string.Empty;
    
    // Nested DTOs
    public SignatureDto? Signature { get; set; }
    public TechnicalFocusDto? TechnicalFocus { get; set; }
}



