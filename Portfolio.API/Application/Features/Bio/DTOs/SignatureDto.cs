
using System.Text.Json.Serialization;

namespace Portfolio.API.Application.Features.Bio.DTOs;

public class SignatureDto
{
    public Guid Id { get; set; }
    
    public Guid BioId { get; set; }
    
    public string Role { get; set; } = string.Empty;
    public string Role_Ar { get; set; } = string.Empty;
    
    public string Name { get; set; } = string.Empty;
    public string Name_Ar { get; set; } = string.Empty;
    
    public string Subtitle { get; set; } = string.Empty;
    public string Subtitle_Ar { get; set; } = string.Empty;
    
    public string VerifiedText { get; set; } = string.Empty;
    public string VerifiedText_Ar { get; set; } = string.Empty;
}



