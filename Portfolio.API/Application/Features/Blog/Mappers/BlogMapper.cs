using Portfolio.API.Entities;
using Portfolio.API.Application.Features.Blog.DTOs;

namespace Portfolio.API.Application.Features.Blog.Mappers;

public class BlogMapper
{
<<<<<<< HEAD
=======
    /// <summary>
    /// Create a BlogPostDto populated from the provided BlogPost entity.
    /// </summary>
    /// <param name="entity">The source BlogPost to map from.</param>
    /// <returns>
    /// A BlogPostDto with fields copied from the entity. If the entity's Summary or Content is null they are returned as an empty string; if the entity's Author is null it is returned as "Mostafa Samir Said".
    /// </returns>
>>>>>>> origin/master
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

<<<<<<< HEAD
=======
    /// <summary>
    /// Copies values from a BlogPostDto into an existing BlogPost instance, updating its mapped properties.
    /// </summary>
    /// <param name="entity">The BlogPost to update; its properties are modified in place.</param>
    /// <param name="dto">The source BlogPostDto providing new property values.</param>
>>>>>>> origin/master
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



