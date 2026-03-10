using System;

namespace Portfolio.API.Application.Features.Blog.DTOs;

public class BlogPostDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Title_Ar { get; set; }
    public string Summary { get; set; } = string.Empty;
    public string? Summary_Ar { get; set; }
    public string Content { get; set; } = string.Empty;
    public string? Content_Ar { get; set; }
    public string? ImageUrl { get; set; }
    public string? SocialUrl { get; set; }
    public string? SocialType { get; set; }
    public DateTime PublishedAt { get; set; }
    public string? Tags { get; set; }
    public string? Tags_Ar { get; set; }
    public string Author { get; set; } = "Mostafa Samir Said";
    public int LikesCount { get; set; }
    public int CommentsCount { get; set; }
    public int StarsCount { get; set; }
    public int ForksCount { get; set; }
    public int Version { get; set; } = 1;
}



