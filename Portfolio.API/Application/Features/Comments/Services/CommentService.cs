using Portfolio.API.Entities;
using Portfolio.API.Repositories;
using Portfolio.API.Application.Features.Comments.DTOs;
using Portfolio.API.Application.Features.Comments.Mappers;
using Portfolio.API.Application.Features.Notifications.Services;
using Portfolio.API.Constants;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;

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

    public async Task<CommentDto> AddCommentAsync(Guid projectId, CommentCreateDto request)
    {
        _logger.LogInformation("Adding comment to project: {ProjectId}", projectId);

        // Check if project exists
        var project = await _unitOfWork.Repository<Project>().GetByIdAsync(projectId);
        if (project == null)
        {
            throw new ArgumentException("Project not found");
        }

        var comment = new Comment
        {
            Id = Guid.NewGuid(),
            ProjectId = projectId,
            Author = request.Author,
            AvatarUrl = request.AvatarUrl,
            Content = request.Content,
            Date = DateTime.UtcNow.ToString("MMM dd, yyyy"),
            Likes = 0,
            RepliesJson = "[]",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _unitOfWork.Repository<Comment>().AddAsync(comment);
        await _unitOfWork.CompleteAsync();

        // Create notification
        await _notificationService.CreateNotificationAsync(
            NotificationTypeConstants.Comment,
            "New Comment",
            $"{request.Author} commented on project '{project.Title}'",
            $"/projects/{project.Slug}",
            "message-circle",
            projectId.ToString(),
            "Project",
            request.Author
        );

        _logger.LogInformation("Comment added successfully: {CommentId}", comment.Id);
        return CommentMapper.ToResponse(comment);
    }

    public async Task<CommentDto> AddReplyAsync(Guid projectId, Guid commentId, CommentCreateDto request)
    {
        _logger.LogInformation("Adding reply to comment: {CommentId} on project: {ProjectId}", commentId, projectId);

        // Get the comment
        var comment = await _unitOfWork.Repository<Comment>()
            .Query()
            .FirstOrDefaultAsync(c => c.Id == commentId && c.ProjectId == projectId);

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
                _logger.LogWarning("Failed to deserialize replies JSON: {Error}", ex.Message);
            }
        }

        // Add new reply
        var reply = new ReplyDto
        {
            Id = Guid.NewGuid(),
            Author = request.Author,
            AvatarUrl = request.AvatarUrl,
            Content = request.Content,
            Date = DateTime.UtcNow
        };

        replies.Add(reply);

        // Update comment with new replies
        comment.RepliesJson = JsonSerializer.Serialize(replies);
        comment.UpdatedAt = DateTime.UtcNow;

        _unitOfWork.Repository<Comment>().Update(comment);
        await _unitOfWork.CompleteAsync();

        // Get project for notification
        var project = await _unitOfWork.Repository<Project>().GetByIdAsync(projectId);

        // Create notification
        await _notificationService.CreateNotificationAsync(
            NotificationTypeConstants.Reply,
            "New Reply",
            $"{request.Author} replied to a comment on project '{project?.Title}'",
            $"/projects/{project?.Slug}",
            "corner-down-right",
            projectId.ToString(),
            "Project",
            request.Author
        );

        _logger.LogInformation("Reply added successfully: {ReplyId}", reply.Id);
        return CommentMapper.ToResponse(comment);
    }

    public async Task<int> LikeCommentAsync(Guid projectId, Guid commentId)
    {
        _logger.LogInformation("Liking comment: {CommentId} on project: {ProjectId}", commentId, projectId);

        var comment = await _unitOfWork.Repository<Comment>()
            .Query()
            .FirstOrDefaultAsync(c => c.Id == commentId && c.ProjectId == projectId);

        if (comment == null)
        {
            throw new ArgumentException("Comment not found");
        }

        comment.Likes++;
        comment.UpdatedAt = DateTime.UtcNow;

        _unitOfWork.Repository<Comment>().Update(comment);
        await _unitOfWork.CompleteAsync();

        _logger.LogInformation("Comment liked successfully. New like count: {Likes}", comment.Likes);
        return comment.Likes;
    }
}


