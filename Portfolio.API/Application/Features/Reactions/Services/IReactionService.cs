using Portfolio.API.Application.Features.Reactions.DTOs;

namespace Portfolio.API.Application.Features.Reactions.Services;

public interface IReactionService
{
    Task<ReactionDto> AddReactionAsync(Guid projectId, ReactionCreateDto request);
    Task<bool> RemoveReactionAsync(Guid projectId, string userId);
    /// <summary>
/// Retrieves all reactions associated with the specified project.
/// </summary>
/// <param name="projectId">The unique identifier of the project.</param>
/// <returns>A list of ReactionDto representing each reaction for the project; an empty list if there are no reactions.</returns>
Task<List<ReactionDto>> GetProjectReactionsAsync(Guid projectId);
    /// <summary>
/// Gets the total number of reactions for the specified project.
/// </summary>
/// <param name="projectId">The identifier of the project whose reactions are counted.</param>
/// <returns>The total number of reactions for the project.</returns>
Task<int> GetReactionCountAsync(Guid projectId);
}



