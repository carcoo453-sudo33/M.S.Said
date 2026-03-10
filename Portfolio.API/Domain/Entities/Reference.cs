using System;
using System.ComponentModel.DataAnnotations;

namespace Portfolio.API.Entities;

public class Reference : BaseEntity
{
    [Required]
    public string Name { get; set; } = string.Empty;
    public string? Name_Ar { get; set; }
    
    public string? Role { get; set; }
    public string? Role_Ar { get; set; }
    
    public string? Company { get; set; }
    public string? Company_Ar { get; set; }
    
    [Required]
    public string Content { get; set; } = string.Empty;
    public string? Content_Ar { get; set; }
    
    public string? ImagePath { get; set; } // Local upload path
    
    public string? Phone { get; set; }
    
    public string? Email { get; set; }
    
    public string? SocialLink { get; set; } // Single social link (LinkedIn, Twitter, etc.)
    
    public DateTime PublishedAt { get; set; } = DateTime.UtcNow;
}
