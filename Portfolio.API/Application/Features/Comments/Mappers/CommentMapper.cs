using Portfolio.API.Entities;
using Portfolio.API.Application.Features.Comments.DTOs;
using Portfolio.API.Helpers;

namespace Portfolio.API.Application.Features.Comments.Mappers;

public static class CommentMapper
{
    /// <summary>
    /// Converts a Comment entity into a CommentDto suitable for API responses.
    /// </summary>
    /// <param name="entity">The source Comment entity to convert.</param>
    /// <returns>A CommentDto with fields mapped from the entity; AvatarUrl is an empty string when the source is null, Date is parsed from entity.Date or falls back to DateTime.UtcNow if parsing fails, and Replies are deserialized from RepliesJson.</returns>
    public static CommentDto ToResponse(Comment entity)
    {
        var replies = JsonHelper.DeserializeList<ReplyDto>(entity.RepliesJson);

        return new CommentDto
        {
            Id = entity.Id,
            Author = entity.Author,
            AvatarUrl = entity.AvatarUrl ?? string.Empty,
            Content = entity.Content,
            Date = DateTime.TryParse(entity.Date, out var parsedDate) ? parsedDate : DateTime.UtcNow,
            Likes = entity.Likes,
            Replies = replies
        };
    }
}


