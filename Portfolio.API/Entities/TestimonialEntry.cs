using System;
using System.ComponentModel.DataAnnotations;

namespace Portfolio.API.Entities;

public class TestimonialEntry : BaseEntity
{
    [Required]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    public string Role { get; set; } = string.Empty;
    
    [Required]
    public string Content { get; set; } = string.Empty;
    
    public string? Company { get; set; }
    
    public string? AvatarUrl { get; set; }
    
    public int Order { get; set; } = 0;
    
    public bool IsFeatured { get; set; } = false;
}
