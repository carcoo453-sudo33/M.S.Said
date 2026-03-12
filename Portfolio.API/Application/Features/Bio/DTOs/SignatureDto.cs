
using System.Text.Json.Serialization;

namespace Portfolio.API.Application.Features.Bio.DTOs;

public class SignatureDto
{
    public Guid Id { get; set; }
    
    public Guid BioId { get; set; }
    
    public string? Role { get; set; }
    public string? Role_Ar { get; set; }
    
    public string? Name { get; set; }
    public string? Name_Ar { get; set; }
    
    public string? Subtitle { get; set; }
    public string? Subtitle_Ar { get; set; }
    
    public string? VerifiedText { get; set; }
    public string? VerifiedText_Ar { get; set; }
}



