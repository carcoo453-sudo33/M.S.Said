namespace Portfolio.API.Application.Features.References.DTOs;

public class ReferenceDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Name_Ar { get; set; }
    public string? Role { get; set; }
    public string? Role_Ar { get; set; }
    public string? Company { get; set; }
    public string? Company_Ar { get; set; }
    public string Content { get; set; } = string.Empty;
    public string? Content_Ar { get; set; }
    public string? ImagePath { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? SocialLink { get; set; }
    public DateTime PublishedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}



