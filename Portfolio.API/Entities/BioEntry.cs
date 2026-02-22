using System;

namespace Portfolio.API.Entities;

public class BioEntry : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty; // e.g., "Full Stack Developer"
    public string Description { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }

    // Professional Statistics
    public string YearsOfExperience { get; set; } = "5+";
    public string ProjectsCompleted { get; set; } = "40+";
    public string CodeCommits { get; set; } = "12k";
}
