using System;

namespace Portfolio.API.Entities;

public class BlogPost : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public DateTime PublishedAt { get; set; } = DateTime.UtcNow;
    public string? Tags { get; set; } // Comma-separated tags
    public string Author { get; set; } = "مصطفى سمير سعيد";
}
