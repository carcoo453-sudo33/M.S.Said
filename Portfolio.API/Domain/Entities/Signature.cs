using System;

namespace Portfolio.API.Entities;

public class Signature : BaseEntity
{
    public Guid BioId { get; set; }
    
    public string? Role { get; set; } // e.g., "Strategic Lead"
    public string? Role_Ar { get; set; }
    
    public string? Name { get; set; } // e.g., "Mostafa Samir Said"
    public string? Name_Ar { get; set; }
    
    public string? Subtitle { get; set; } // e.g., "Dev. M.Said"
    public string? Subtitle_Ar { get; set; }
    
    public string? VerifiedText { get; set; } // e.g., "Verified Origin"
    public string? VerifiedText_Ar { get; set; }

    // Navigation Property
    public virtual Bio? Bio { get; set; }
}
