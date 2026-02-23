using System;

namespace Portfolio.API.DTOs;

public class TestimonialDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? Company { get; set; }
    public string? AvatarUrl { get; set; }
    public int Order { get; set; }
    public bool IsFeatured { get; set; }
}
