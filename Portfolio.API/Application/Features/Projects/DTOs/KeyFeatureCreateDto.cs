namespace Portfolio.API.Features.Projects.DTOs;

public class KeyFeatureCreateDto
{
    public string Title { get; set; } = string.Empty;
    public string? Title_Ar { get; set; }
    public string? Link { get; set; }
    public string? Date { get; set; }
    public string FeatureType { get; set; } = "added";
}