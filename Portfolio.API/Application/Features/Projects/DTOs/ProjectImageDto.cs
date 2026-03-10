using Portfolio.API.Domain.Enums;

namespace Portfolio.API.Application.Features.Projects.DTOs;

public class ProjectImageDto
{
    public Guid Id { get; set; }
    public Guid ProjectId { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Title_Ar { get; set; }
    public ProjectImageType Type { get; set; } = ProjectImageType.Real;
    public int Order { get; set; }
    public string? Description { get; set; }
    public string? Description_Ar { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}




