using Portfolio.API.Application.Features.Comments.DTOs;

namespace Portfolio.API.Application.Features.Comments.Services;

public interface ICommentService
{
    /// <summary>
/// Creates a new comment for the specified project.
/// </summary>
/// <param name="projectId">Identifier of the project to which the comment will be added.</param>
/// <param name="request">Payload containing the comment content and related creation data.</param>
/// <returns>A CommentDto representing the newly created comment.</returns>
Task<CommentDto> AddCommentAsync(Guid projectId, CommentCreateDto request);
    /// <summary>
/// Adds a reply to an existing comment on the specified project.
/// </summary>
/// <param name="projectId">The identifier of the project that contains the parent comment.</param>
/// <param name="commentId">The identifier of the parent comment to which the reply will be added.</param>
/// <param name="request">The data for the reply to create.</param>
/// <returns>The created reply as a <see cref="CommentDto"/>.</returns>
Task<CommentDto> AddReplyAsync(Guid projectId, Guid commentId, CommentCreateDto request);
    /// <summary>
/// Adds a like to the specified comment within a project.
/// </summary>
/// <param name="projectId">The identifier of the project that contains the comment.</param>
/// <param name="commentId">The identifier of the comment to like.</param>
/// <returns>The updated total number of likes for the comment.</returns>
Task<int> LikeCommentAsync(Guid projectId, Guid commentId);
}


