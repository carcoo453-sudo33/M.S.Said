using Portfolio.API.Application.Features.Reactions.DTOs;

namespace Portfolio.API.Application.Features.Reactions.Services;

public interface IReactionService
{
    Task<ReactionDto> AddReactionAsync(Guid projectId, ReactionCreateDto request);
    Task<bool> RemoveReactionAsync(Guid projectId, string userId);
    Task<List<ReactionDto>> GetProjectReactionsAsync(Guid projectId);
    Task<int> GetReactionCountAsync(Guid projectId);
}



