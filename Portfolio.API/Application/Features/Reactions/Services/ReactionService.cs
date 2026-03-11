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

    /// <summary>
    /// Adds a new reaction from a user to a specific project.
    /// This method enforces a unique constraint so a user cannot react multiple times to the same project.
    /// </summary>
    /// <param name="projectId">The unique identifier of the project.</param>
    /// <param name="request">The details of the reaction being added.</param>
    /// <returns>A DTO containing the details of the created reaction.</returns>
    /// <exception cref="ArgumentException">Thrown when the project doesn't exist or if the user has already reacted.</exception>
    public async Task<ReactionDto> AddReactionAsync(Guid projectId, ReactionCreateDto request)
    {
        _logger.LogInformation("Adding reaction to project: {ProjectId} by user: {UserId}", projectId, request.UserId);

        // Check if project exists
        var project = await _unitOfWork.Repository<Project>().GetByIdAsync(projectId);
        if (project == null)
        {
            throw new ArgumentException("Project not found");
        }

        var reaction = ReactionMapper.ToEntity(projectId, request);
        await _unitOfWork.Repository<Reaction>().AddAsync(reaction);

        try
        {
            await _unitOfWork.CompleteAsync();
            
            // Only increment the project reactions count *after* the unique reaction insert successfully saves.
            // This prevents lost updates and dangling counts if the insert fails (e.g., due to duplicate).
            project.ReactionsCount++;
            _unitOfWork.Repository<Project>().Update(project);
            await _unitOfWork.CompleteAsync();
        }
        catch (DbUpdateException ex)
        {
            // The DB Unique Constraint (ProjectId, UserId) will trigger an exception if the user already reacted.
            _logger.LogWarning(ex, "Failed to add reaction. User {UserId} already reacted to project {ProjectId}", request.UserId, projectId);
            throw new ArgumentException("User has already reacted to this project");
        }

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

    /// <summary>
    /// Removes an existing reaction from a user for a specific project.
    /// Also decrements the project's total reaction count upon successful removal.
    /// </summary>
    /// <param name="projectId">The unique identifier of the project.</param>
    /// <param name="userId">The unique identifier of the user whose reaction is being removed.</param>
    /// <returns>True if the reaction was successfully removed; otherwise, false.</returns>
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

    /// <summary>
    /// Retrieves a list of all reactions for a specified project.
    /// </summary>
    /// <param name="projectId">The unique identifier of the project.</param>
    /// <returns>A list of reaction DTOs associated with the project.</returns>
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
<<<<<<< HEAD
    /// Retrieves the total count of reactions for a specified project.
    /// </summary>
    /// <param name="projectId">The unique identifier of the project.</param>
    /// <returns>The number of reactions on the project.</returns>
=======
    /// Gets the number of reactions for the specified project.
    /// </summary>
    /// <param name="projectId">The project's unique identifier.</param>
    /// <returns>The number of reactions associated with the project.</returns>
>>>>>>> origin/master
    public async Task<int> GetReactionCountAsync(Guid projectId)
    {
        _logger.LogInformation("Getting reaction count for project: {ProjectId}", projectId);

        return await _unitOfWork.Repository<Reaction>()
            .Query()
            .CountAsync(r => r.ProjectId == projectId);
    }
}



