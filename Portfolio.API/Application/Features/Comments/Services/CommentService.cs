using Portfolio.API.Entities;
using Portfolio.API.Repositories;
using Portfolio.API.Application.Features.Comments.DTOs;
using Portfolio.API.Application.Features.Comments.Mappers;
using Portfolio.API.Application.Features.Notifications.Services;
using Portfolio.API.Constants;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Portfolio.API.Helpers;

namespace Portfolio.API.Application.Features.Comments.Services;

public class CommentService : ICommentService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly INotificationService _notificationService;
    private readonly ILogger<CommentService> _logger;

    public CommentService(
        IUnitOfWork unitOfWork,
        INotificationService notificationService,
        ILogger<CommentService> logger)
    {
        _unitOfWork = unitOfWork;
        _notificationService = notificationService;
        _logger = logger;
    }

    /// <summary>
    /// Create and persist a new comment for the specified project and emit a notification.
    /// </summary>
    /// <param name="projectId">The project identifier to which the comment will be added.</param>
    /// <param name="request">A CommentCreateDto containing the comment author, content, and optional avatar URL.</param>
    /// <param name="cancellationToken">Token to cancel the operation.</param>
    /// <returns>The created comment mapped to a <c>CommentDto</c>.</returns>
    /// <exception cref="ArgumentException">Thrown when a project with the specified <paramref name="projectId"/> does not exist.</exception>
    public async Task<CommentDto> AddCommentAsync(Guid projectId, CommentCreateDto request, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Adding comment to project: {ProjectId}", projectId);

        // Check if project exists using Any() instead of GetByIdAsync for better performance
        var projectExists = await _unitOfWork.Repository<Project>()
            .Query()
            .AsNoTracking()
            .AnyAsync(p => p.Id == projectId, cancellationToken);

        if (!projectExists)
        {
            throw new ArgumentException("Project not found");
        }

        var comment = new Comment
        {
            Id = Guid.NewGuid(),
            ProjectId = projectId,
            Author = SanitizationHelper.Sanitize(request.Author),
            AvatarUrl = request.AvatarUrl,
            Content = SanitizationHelper.Sanitize(request.Content),
            Date = DateTime.UtcNow.ToString("MMM dd, yyyy"),
            Likes = 0,
            RepliesJson = "[]",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _unitOfWork.Repository<Comment>().AddAsync(comment);
        await _unitOfWork.CompleteAsync(cancellationToken);

        // Get project details for notification (only when needed)
        var project = await _unitOfWork.Repository<Project>()
            .Query()
            .AsNoTracking()
            .Select(p => new { p.Id, p.Title, p.Slug })
            .FirstOrDefaultAsync(p => p.Id == projectId, cancellationToken);

        if (project != null)
        {
            // Create notification
            await _notificationService.CreateNotificationAsync(
                NotificationTypeConstants.Comment,
                "New Comment",
                $"{request.Author} commented on project '{project.Title}'",
                $"/projects/{project.Slug}",
                "message-circle",
                projectId.ToString(),
                "Project",
                request.Author,
                null,
                cancellationToken
            );
        }

        _logger.LogInformation("Comment added successfully: {CommentId}", comment.Id);
        return CommentMapper.ToResponse(comment);
    }

    /// <summary>
    /// Adds a reply to an existing comment on a project, persists the updated comment, and emits a notification.
    /// </summary>
    /// <param name="projectId">The identifier of the project that contains the comment.</param>
    /// <param name="commentId">The identifier of the comment to reply to.</param>
    /// <param name="request">The reply data (author, content, avatar URL).</param>
    /// <param name="cancellationToken">Token to cancel the operation.</param>
    /// <returns>The updated comment mapped to a <see cref="CommentDto"/>.</returns>
    /// <exception cref="ArgumentException">Thrown when the target comment cannot be found.</exception>
    public async Task<CommentDto> AddReplyAsync(Guid projectId, Guid commentId, CommentCreateDto request, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Adding reply to comment: {CommentId} on project: {ProjectId}", commentId, projectId);

        // Get the comment
        var comment = await _unitOfWork.Repository<Comment>()
            .Query()
            .FirstOrDefaultAsync(c => c.Id == commentId && c.ProjectId == projectId, cancellationToken);

        if (comment == null)
        {
            throw new ArgumentException("Comment not found");
        }

        // Get existing replies
        var replies = new List<ReplyDto>();
        if (!string.IsNullOrEmpty(comment.RepliesJson))
        {
            try
            {
                replies = JsonSerializer.Deserialize<List<ReplyDto>>(comment.RepliesJson) ?? new List<ReplyDto>();
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "Failed to deserialize replies JSON for comment {CommentId}. Aborting to prevent data loss.", commentId);
                throw new InvalidOperationException("Failed to process existing replies due to data corruption.");
            }
        }

        // Add new reply
        var reply = new ReplyDto
        {
            Id = Guid.NewGuid(),
            Author = SanitizationHelper.Sanitize(request.Author),
            AvatarUrl = request.AvatarUrl,
            Content = SanitizationHelper.Sanitize(request.Content),
            Date = DateTime.UtcNow
        };

        const int maxRetries = 3;
        for (int parseAttempt = 0; parseAttempt < maxRetries; parseAttempt++)
        {
            try
            {
                // We re-parse inside the loop in case we had to reload the comment
                var currentReplies = new List<ReplyDto>();
                if (!string.IsNullOrEmpty(comment.RepliesJson))
                {
                    currentReplies = JsonSerializer.Deserialize<List<ReplyDto>>(comment.RepliesJson) ?? new List<ReplyDto>();
                }
                currentReplies.Add(reply);

                comment.RepliesJson = JsonSerializer.Serialize(currentReplies);
                comment.UpdatedAt = DateTime.UtcNow;

                _unitOfWork.Repository<Comment>().Update(comment);
                await _unitOfWork.CompleteAsync(cancellationToken);
                break; // Success
            }
            catch (DbUpdateConcurrencyException ex)
            {
                _logger.LogWarning(ex, "Concurrency exception while adding reply to comment {CommentId}. Attempt {Attempt} of {MaxRetries}", commentId, parseAttempt + 1, maxRetries);
                
                if (parseAttempt == maxRetries - 1)
                {
                    throw new InvalidOperationException("Failed to add reply due to concurrent updates. Please try again.");
                }

                // Reload the entity from the database to get the latest values including RepliesJson and RowVersion
                await ex.Entries.Single().ReloadAsync(cancellationToken);
            }
            catch (JsonException ex)
            {
                 _logger.LogError(ex, "Failed to deserialize replies JSON for comment {CommentId} during retry.", commentId);
                 throw new InvalidOperationException("Failed to process existing replies due to data corruption.");
            }
        }

        // Get project details for notification (only when needed, with null safety)
        var project = await _unitOfWork.Repository<Project>()
            .Query()
            .AsNoTracking()
            .Select(p => new { p.Id, p.Title, p.Slug })
            .FirstOrDefaultAsync(p => p.Id == projectId, cancellationToken);

        if (project != null)
        {
            // Create notification
            await _notificationService.CreateNotificationAsync(
                NotificationTypeConstants.Reply,
                "New Reply",
                $"{request.Author} replied to a comment on project '{project.Title}'",
                $"/projects/{project.Slug}",
                "corner-down-right",
                projectId.ToString(),
                "Project",
                request.Author,
                null,
                cancellationToken
            );
        }

        _logger.LogInformation("Reply added successfully: {ReplyId}", reply.Id);
        return CommentMapper.ToResponse(comment);
    }

    /// <summary>
    /// Increments the like count of a comment belonging to the specified project.
    /// </summary>
    /// <param name="projectId">The identifier of the project that contains the comment.</param>
    /// <param name="commentId">The identifier of the comment to like.</param>
    /// <param name="cancellationToken">Token to cancel the operation.</param>
    /// <returns>The updated number of likes for the comment.</returns>
    /// <exception cref="ArgumentException">Thrown when a comment with the specified projectId and commentId does not exist.</exception>
    public async Task<int> LikeCommentAsync(Guid projectId, Guid commentId, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Liking comment: {CommentId} on project: {ProjectId}", commentId, projectId);

        var comment = await _unitOfWork.Repository<Comment>()
            .Query()
            .FirstOrDefaultAsync(c => c.Id == commentId && c.ProjectId == projectId, cancellationToken);

        if (comment == null)
        {
            throw new ArgumentException("Comment not found");
        }

        const int maxRetries = 3;
        for (int attempt = 0; attempt < maxRetries; attempt++)
        {
            try
            {
                comment.Likes++;
                comment.UpdatedAt = DateTime.UtcNow;

                _unitOfWork.Repository<Comment>().Update(comment);
                await _unitOfWork.CompleteAsync(cancellationToken);
                break; // Success
            }
            catch (DbUpdateConcurrencyException ex)
            {
                _logger.LogWarning(ex, "Concurrency exception while liking comment {CommentId}. Attempt {Attempt} of {MaxRetries}", commentId, attempt + 1, maxRetries);

                if (attempt == maxRetries - 1)
                {
                    throw new InvalidOperationException("Failed to like comment due to concurrent updates. Please try again.");
                }

                // Reload the entity to get the latest Likes count and RowVersion
                await ex.Entries.Single().ReloadAsync(cancellationToken);
            }
        }

        _logger.LogInformation("Comment liked successfully. New like count: {Likes}", comment.Likes);
        return comment.Likes;
    }
}


