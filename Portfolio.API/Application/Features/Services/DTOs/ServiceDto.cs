namespace Portfolio.API.Application.Features.Services.DTOs;

public class ServiceDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Title_Ar { get; set; }
    public string Description { get; set; } = string.Empty;
    public string? Description_Ar { get; set; }
    public string Icon { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
