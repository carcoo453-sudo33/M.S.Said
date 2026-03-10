namespace Portfolio.API.Application.Common;

/// <summary>
/// Unified import request DTO for importing content from external sources
/// Supports: GitHub (Projects), Medium, Dev.to, StackOverflow, LinkedIn, and generic blogs
/// </summary>
public class ImportRequest
{
    /// <summary>
    /// Source URL to import from (GitHub, Medium, Dev.to, StackOverflow, LinkedIn, or blog URL)
    /// </summary>
    public string Url { get; set; } = string.Empty;
    
    /// <summary>
    /// Type of import: GitHub, Medium, DevTo, StackOverflow, LinkedIn, Blog
    /// </summary>
    public string ImportType { get; set; } = "Blog"; // Default to Blog
    
    // Optional overrides for extracted data
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Author { get; set; }
    public string? Tags { get; set; }
    
    // Project-specific fields
    public string? TechStack { get; set; }
    public string? Company { get; set; }
    public string? GitHubUrl { get; set; }
    
    // Control flags - General
    public bool ExtractMetadata { get; set; } = true;
    public bool ExtractImages { get; set; } = true;
    public bool PublishImmediately { get; set; } = false;
    
    // Control flags - Project-specific
    public bool ExtractReadme { get; set; } = true;
    public bool FetchLanguages { get; set; } = true;
    public bool FetchRepositoryStats { get; set; } = true;
    
    // Control flags - Blog-specific
    public bool ExtractContent { get; set; } = true;
    public bool ExtractAuthor { get; set; } = true;
    public bool ExtractPublishedDate { get; set; } = true;
}
