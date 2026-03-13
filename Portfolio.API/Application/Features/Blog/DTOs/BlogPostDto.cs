using System;
using System.Text.Json.Serialization;

namespace Portfolio.API.Application.Features.Blog.DTOs;

public class BlogPostDto
{
    [JsonRequired]
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Title_Ar { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public string Summary_Ar { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Content_Ar { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string SocialUrl { get; set; } = string.Empty;
    public string SocialType { get; set; } = string.Empty;
    
    [JsonRequired]
    public DateTime PublishedAt { get; set; }
    public string Tags { get; set; } = string.Empty;
    public string Tags_Ar { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    
    [JsonRequired]
    public int LikesCount { get; set; }    
    
    [JsonRequired]
    public int CommentsCount { get; set; }
    
    [JsonRequired]
    public int StarsCount { get; set; }
    
    [JsonRequired]
    public int ForksCount { get; set; }
    
    [JsonRequired]
    public string Version { get; set; } = "1";
}



