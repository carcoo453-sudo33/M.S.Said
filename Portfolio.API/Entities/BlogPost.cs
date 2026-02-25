using System;

namespace Portfolio.API.Entities;

public class BlogPost : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string? Title_Ar { get; set; }
    public string Summary { get; set; } = string.Empty;
    public string? Summary_Ar { get; set; }
    public string Content { get; set; } = string.Empty;
    public string? Content_Ar { get; set; }
    public string? ImageUrl { get; set; }
    public string? SocialUrl { get; set; }
    public string? SocialType { get; set; } // LinkedIn, Dev.to, GitHub, etc.
    public DateTime PublishedAt { get; set; } = DateTime.UtcNow;
    public string? Tags { get; set; } // Comma-separated tags
    public string? Tags_Ar { get; set; }
    public string Author { get; set; } = "Mostafa Samir Said";
    public int LikesCount { get; set; }
    public int CommentsCount { get; set; }
    public int StarsCount { get; set; } // GitHub specific
    public int ForksCount { get; set; } // GitHub specific
    public string? Version { get; set; } // Release specific
}