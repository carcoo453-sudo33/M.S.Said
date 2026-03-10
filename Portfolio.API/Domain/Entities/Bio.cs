using System;

namespace Portfolio.API.Entities;

public class Bio : BaseEntity
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
    public DateTime CareerStartDate { get; set; } // Start date for calculating years of experience
    public string? GitHubUsername { get; set; } // For fetching commits from GitHub API
    public string YearsOfExperience { get; set; } = "3+";
    public string ProjectsCompleted { get; set; } = "0";
    public string CodeCommits { get; set; } = "0";

    // Education Page Content
    public string? EducationQuote { get; set; }
    public string? EducationQuote_Ar { get; set; }

    // Navigation Properties
    public virtual Signature? Signature { get; set; }
    public virtual TechnicalFocus? TechnicalFocus { get; set; }
}
