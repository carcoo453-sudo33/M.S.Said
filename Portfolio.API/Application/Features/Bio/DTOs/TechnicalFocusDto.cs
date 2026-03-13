using System.Text.Json.Serialization;

namespace Portfolio.API.Application.Features.Bio.DTOs;

public class TechnicalFocusDto
{
    public Guid Id { get; set; }
    
    public Guid BioId { get; set; }
    
    public string Title { get; set; } = string.Empty;
    public string Title_Ar { get; set; } = string.Empty;
    
    public string Description { get; set; } = string.Empty;
    public string Description_Ar { get; set; } = string.Empty;
    
    public string Items { get; set; } = string.Empty;
    public string Items_Ar { get; set; } = string.Empty;
}



