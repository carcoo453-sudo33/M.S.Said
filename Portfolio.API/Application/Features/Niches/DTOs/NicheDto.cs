namespace Portfolio.API.Application.Features.Niches.DTOs;

public class NicheDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Name_Ar { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}



