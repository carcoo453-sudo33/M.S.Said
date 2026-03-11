using System;

namespace Portfolio.API.Entities;

public class Service : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string? Title_Ar { get; set; }
    
    public string Description { get; set; } = string.Empty;
    public string? Description_Ar { get; set; }
    
    public string? IconPath { get; set; } // Local upload path for service icon/image
    
    public int Order { get; set; }
    
    // Navigation Property
    public virtual Seo? Seo { get; set; }
}
