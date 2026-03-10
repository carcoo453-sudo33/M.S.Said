using Portfolio.API.Entities;
using Portfolio.API.Application.Features.Blog.DTOs;

namespace Portfolio.API.Application.Features.Blog.Mappers;

public class BlogMapper
{
    public static BlogPostDto ToDto(BlogPost entity)
    {
        return new BlogPostDto
        {
            Id = entity.Id,
            Title = entity.Title,
            Title_Ar = entity.Title_Ar,
            Summary = entity.Summary ?? string.Empty,
            Summary_Ar = entity.Summary_Ar,
            Content = entity.Content ?? string.Empty,
            Content_Ar = entity.Content_Ar,
            ImageUrl = entity.ImageUrl,
            SocialUrl = entity.SocialUrl,
            SocialType = entity.SocialType,
            PublishedAt = entity.PublishedAt,
            Tags = entity.Tags,
            Tags_Ar = entity.Tags_Ar,
            Author = entity.Author ?? "Mostafa Samir Said",
            LikesCount = entity.LikesCount,
            CommentsCount = entity.CommentsCount,
            StarsCount = entity.StarsCount,
            ForksCount = entity.ForksCount,
            Version = entity.Version
        };
    }

    public static void UpdateEntity(BlogPost entity, BlogPostDto dto)
    {
        entity.Title = dto.Title;
        entity.Title_Ar = dto.Title_Ar;
        entity.Summary = dto.Summary;
        entity.Summary_Ar = dto.Summary_Ar;
        entity.Content = dto.Content;
        entity.Content_Ar = dto.Content_Ar;
        entity.ImageUrl = dto.ImageUrl;
        entity.SocialUrl = dto.SocialUrl;
        entity.SocialType = dto.SocialType;
        entity.PublishedAt = dto.PublishedAt;
        entity.Tags = dto.Tags;
        entity.Tags_Ar = dto.Tags_Ar;
        entity.Author = dto.Author;
        entity.LikesCount = dto.LikesCount;
        entity.CommentsCount = dto.CommentsCount;
        entity.StarsCount = dto.StarsCount;
        entity.ForksCount = dto.ForksCount;
        entity.Version = dto.Version;
    }
}



