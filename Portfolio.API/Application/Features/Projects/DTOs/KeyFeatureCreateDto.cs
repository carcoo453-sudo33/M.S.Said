using Portfolio.API.Domain.Enums;

namespace Portfolio.API.Application.Features.Projects.DTOs;

public class KeyFeatureCreateDto
{
    public string Title { get; set; } = string.Empty;
    public string? Title_Ar { get; set; }
    public string? Link { get; set; }
    public string? Date { get; set; }
    public FeatureType FeatureType { get; set; } = FeatureType.Added;
}



