using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Portfolio.API.Entities;

public class Comment : BaseEntity
{
    public Guid ProjectId { get; set; }
    
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