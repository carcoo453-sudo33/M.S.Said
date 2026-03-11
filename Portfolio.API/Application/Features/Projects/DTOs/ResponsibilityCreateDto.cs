namespace Portfolio.API.Application.Features.Projects.DTOs;

public class ResponsibilityCreateDto
{
    public string Title { get; set; } = string.Empty;
    public string? Title_Ar { get; set; }
    public string Description { get; set; } = string.Empty;
    public string? Description_Ar { get; set; }
}


