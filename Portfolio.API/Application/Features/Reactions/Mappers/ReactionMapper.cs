using Portfolio.API.Entities;
using Portfolio.API.Application.Features.Reactions.DTOs;
using Portfolio.API.Domain.Enums;

namespace Portfolio.API.Application.Features.Reactions.Mappers;

public static class ReactionMapper
{
    public static ReactionDto ToResponse(Reaction entity)
    {
        return new ReactionDto
        {
            Id = entity.Id,
            ProjectId = entity.ProjectId,
            UserId = entity.UserId,
            ReactionType = entity.ReactionType.ToString(),
            CreatedAt = entity.CreatedAt
        };
    }

    public static Reaction ToEntity(Guid projectId, ReactionCreateDto request)
    {
        return new Reaction
        {
            Id = Guid.NewGuid(),
            ProjectId = projectId,
            UserId = request.UserId,
            ReactionType = Enum.TryParse<ReactionType>(request.ReactionType, ignoreCase: true, out var reactionType)
                ? reactionType
                : throw new ArgumentException($"Invalid reaction type: {request.ReactionType}", nameof(request.ReactionType)),
            CreatedAt = DateTime.UtcNow
        };
    }
}



