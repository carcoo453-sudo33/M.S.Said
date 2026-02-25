using System;

namespace Portfolio.API.Entities;

public class BioEntry : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Name_Ar { get; set; }
    
    public string Title { get; set; } = string.Empty; // e.g., "Full Stack Developer"
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

    // Professional Statistics
    public string YearsOfExperience { get; set; } = "5+";
    public string ProjectsCompleted { get; set; } = "40+";
    public string CodeCommits { get; set; } = "12k";

    // Education Page Content
    public string? EducationQuote { get; set; }
    public string? EducationQuote_Ar { get; set; }
    
    // Signature Section
    public string? SignatureRole { get; set; } // e.g., "Strategic Lead"
    public string? SignatureRole_Ar { get; set; }
    
    public string? SignatureName { get; set; } // e.g., "Mostafa Samir Said"
    public string? SignatureName_Ar { get; set; }
    
    public string? SignatureSubtitle { get; set; } // e.g., "Arch. Design"
    public string? SignatureSubtitle_Ar { get; set; }
    
    public string? SignatureVerifiedText { get; set; } // e.g., "Verified Origin"
    public string? SignatureVerifiedText_Ar { get; set; }
    
    public string? TechnicalFocusTitle { get; set; }
    public string? TechnicalFocusTitle_Ar { get; set; }
    
    public string? TechnicalFocusDescription { get; set; }
    public string? TechnicalFocusDescription_Ar { get; set; }
    
    public string? TechnicalFocusItems { get; set; } // Comma-separated list
    public string? TechnicalFocusItems_Ar { get; set; }
}
