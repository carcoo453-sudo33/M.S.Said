using Portfolio.API.Entities;
using Portfolio.API.Helpers;
using Portfolio.API.Features.Comments.DTOs;

namespace Portfolio.API.Features.Comments.Mappers;

public static class CommentMapper
{
    public static CommentDto ToResponse(Comment entity)
    {
        var replies = JsonHelper.DeserializeList<ReplyDto>(entity.RepliesJson);

        return new CommentDto
        {
            Id = entity.Id,
            Author = entity.Author,
            AvatarUrl = entity.AvatarUrl,
            Content = entity.Content,
            Date = entity.Date,
            Likes = entity.Likes,
            Replies = replies
        };
    }
}