namespace Portfolio.API.Application.Features.Projects.DTOs;

public class ChangelogItemCreateDto
{
    public string Date { get; set; } = string.Empty;
    public string Version { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Title_Ar { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Description_Ar { get; set; } = string.Empty;
}


