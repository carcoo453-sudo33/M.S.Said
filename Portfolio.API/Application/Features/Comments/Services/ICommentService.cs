using Portfolio.API.Features.Comments.DTOs;

namespace Portfolio.API.Features.Comments.Services;

public interface ICommentService
{
    Task<CommentDto> AddCommentAsync(Guid projectId, CommentCreateDto request);
    Task<CommentDto> AddReplyAsync(Guid projectId, Guid commentId, CommentCreateDto request);
    Task<int> LikeCommentAsync(Guid projectId, Guid commentId);
}