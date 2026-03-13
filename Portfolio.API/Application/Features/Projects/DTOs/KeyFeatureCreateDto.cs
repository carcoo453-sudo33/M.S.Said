using Portfolio.API.Domain.Enums;

namespace Portfolio.API.Application.Features.Projects.DTOs;

public class KeyFeatureCreateDto
{
    public string Title { get; set; } = string.Empty;
    public string Title_Ar { get; set; } = string.Empty;
    public string Link { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
    public FeatureType FeatureType { get; set; } = FeatureType.Added;
}



