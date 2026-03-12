using System.Text.Json.Serialization;

namespace Portfolio.API.Application.Features.Categories.DTOs;

public class CategoryDto
{
    [JsonRequired]
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Name_Ar { get; set; }
    
    [JsonRequired]
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}



