using System;

namespace Portfolio.API.Entities;

public class TechnicalFocus : BaseEntity
{
    public Guid BioId { get; set; }
    
    public string? Title { get; set; }
    public string? Title_Ar { get; set; }
    
    public string? Description { get; set; }
    public string? Description_Ar { get; set; }
    
    public string? Items { get; set; } // Comma-separated list
    public string? Items_Ar { get; set; }

    // Navigation Property
    public virtual Bio? Bio { get; set; }
}
