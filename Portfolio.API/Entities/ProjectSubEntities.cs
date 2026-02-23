using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Portfolio.API.Entities;

public class ProjectKeyFeature : BaseEntity
{
    public Guid ProjectEntryId { get; set; }
    
    [Required]
    public string Icon { get; set; } = string.Empty;
    
    [Required]
    public string Title { get; set; } = string.Empty;
    
    public string Description { get; set; } = string.Empty;
}

public class ProjectChangelogItem : BaseEntity
{
    public Guid ProjectEntryId { get; set; }
    
    public string Date { get; set; } = string.Empty;
    
    public string Version { get; set; } = string.Empty;
    
    [Required]
    public string Title { get; set; } = string.Empty;
    
    public string Description { get; set; } = string.Empty;
}

public class ProjectMetric : BaseEntity
{
    public Guid ProjectEntryId { get; set; }
    
    [Required]
    public string Label { get; set; } = string.Empty;
    
    [Required]
    public string Value { get; set; } = string.Empty;
    
    public string? Trend { get; set; } // "up" or "down"
}

public class ProjectComment : BaseEntity
{
    public Guid ProjectEntryId { get; set; }
    
    [Required]
    public string Author { get; set; } = string.Empty;
    
    public string? AvatarUrl { get; set; }
    
    public string Date { get; set; } = string.Empty;
    
    [Required]
    public string Content { get; set; } = string.Empty;
    
    public int Likes { get; set; }
    
    // Store replies as JSON to avoid complex relationships
    public string? RepliesJson { get; set; }
}
