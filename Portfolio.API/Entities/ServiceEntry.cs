using System;

namespace Portfolio.API.Entities;

public class ServiceEntry : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string? Title_Ar { get; set; }
    
    public string Description { get; set; } = string.Empty;
    public string? Description_Ar { get; set; }
    
    public string Icon { get; set; } = string.Empty; // CSS class or icon name
}
