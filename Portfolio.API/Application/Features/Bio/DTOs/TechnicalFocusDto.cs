namespace Portfolio.API.Application.Features.Bio.DTOs;

public class TechnicalFocusDto
{
    public Guid Id { get; set; }
    public Guid BioId { get; set; }
    
    public string? Title { get; set; }
    public string? Title_Ar { get; set; }
    
    public string? Description { get; set; }
    public string? Description_Ar { get; set; }
    
    public string? Items { get; set; }
    public string? Items_Ar { get; set; }
}



