using Portfolio.API.Repositories;
using Portfolio.API.Application.Features.Reactions.DTOs;
using Portfolio.API.Application.Features.Reactions.Mappers;
using Portfolio.API.Entities;
using Portfolio.API.Application.Features.Notifications.Services;
using Portfolio.API.Constants;
using Microsoft.EntityFrameworkCore;

namespace Portfolio.API.Application.Features.Reactions.Services;

public class ReactionService : IReactionService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly INotificationService _notificationService;
    private readonly ILogger<ReactionService> _logger;

    public ReactionService(
        IUnitOfWork unitOfWork,
        INotificationService notificationService,
        ILogger<ReactionService> logger)
    {
        _unitOfWork = unitOfWork;
        _notificationService = notificationService;
        _logger = logger;
    }

    public async Task<ReactionDto> AddReactionAsync(Guid projectId, ReactionCreateDto request)
    {
        _logger.LogInformation("Adding reaction to project: {ProjectId} by user: {UserId}", projectId, request.UserId);

        // Check if project exists
        var project = await _unitOfWork.Repository<Project>().GetByIdAsync(projectId);
        if (project == null)
        {
            throw new ArgumentException("Project not found");
        }

        // Check if user already reacted
        var existingReaction = await _unitOfWork.Repository<Reaction>()
            .Query()
            .FirstOrDefaultAsync(r => r.ProjectId == projectId && r.UserId == request.UserId);

        if (existingReaction != null)
        {
            throw new ArgumentException("User has already reacted to this project");
        }

        var reaction = ReactionMapper.ToEntity(projectId, request);

        await _unitOfWork.Repository<Reaction>().AddAsync(reaction);
        
        // Increment project reactions count
        project.ReactionsCount++;
        _unitOfWork.Repository<Project>().Update(project);
        
        await _unitOfWork.CompleteAsync();

        // Create notification
        await _notificationService.CreateNotificationAsync(
            NotificationTypeConstants.Reaction,
            "New Reaction",
            $"{request.UserId} reacted to project '{project.Title}'",
            $"/projects/{project.Slug}",
            "heart",
            projectId.ToString(),
            "Project",
            request.UserId
        );

        _logger.LogInformation("Reaction added successfully: {ReactionId}", reaction.Id);
        return ReactionMapper.ToResponse(reaction);
    }

    public async Task<bool> RemoveReactionAsync(Guid projectId, string userId)
    {
        _logger.LogInformation("Removing reaction from project: {ProjectId} by user: {UserId}", projectId, userId);

        var reaction = await _unitOfWork.Repository<Reaction>()
            .Query()
            .FirstOrDefaultAsync(r => r.ProjectId == projectId && r.UserId == userId);

        if (reaction == null)
        {
            _logger.LogWarning("Reaction not found for project: {ProjectId} and user: {UserId}", projectId, userId);
            return false;
        }

        // Get project to decrement reactions count
        var project = await _unitOfWork.Repository<Project>().GetByIdAsync(projectId);
        if (project != null && project.ReactionsCount > 0)
        {
            project.ReactionsCount--;
            _unitOfWork.Repository<Project>().Update(project);
        }

        _unitOfWork.Repository<Reaction>().Delete(reaction);
        await _unitOfWork.CompleteAsync();

        _logger.LogInformation("Reaction removed successfully: {ReactionId}", reaction.Id);
        return true;
    }

    public async Task<List<ReactionDto>> GetProjectReactionsAsync(Guid projectId)
    {
        _logger.LogInformation("Getting reactions for project: {ProjectId}", projectId);

        var reactions = await _unitOfWork.Repository<Reaction>()
            .Query()
            .Where(r => r.ProjectId == projectId)
            .ToListAsync();

        return reactions.Select(ReactionMapper.ToResponse).ToList();
    }

    /// <summary>
    /// Gets the number of reactions for the specified project.
    /// </summary>
    /// <param name="projectId">The project's unique identifier.</param>
    /// <returns>The number of reactions associated with the project.</returns>
    public async Task<int> GetReactionCountAsync(Guid projectId)
    {
        _logger.LogInformation("Getting reaction count for project: {ProjectId}", projectId);

        return await _unitOfWork.Repository<Reaction>()
            .Query()
            .CountAsync(r => r.ProjectId == projectId);
    }
}



