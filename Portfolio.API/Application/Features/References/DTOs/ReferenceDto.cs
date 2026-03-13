namespace Portfolio.API.Application.Features.References.DTOs;

public class ReferenceDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Name_Ar { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Role_Ar { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string Company_Ar { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Content_Ar { get; set; } = string.Empty;
    public string ImagePath { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string SocialLink { get; set; } = string.Empty;
    public DateTime PublishedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}



