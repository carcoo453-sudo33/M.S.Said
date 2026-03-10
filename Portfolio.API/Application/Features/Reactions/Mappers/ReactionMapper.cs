using Portfolio.API.Entities;
using Portfolio.API.Features.Reactions.DTOs;

namespace Portfolio.API.Features.Reactions.Mappers;

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
            ReactionType = Enum.Parse<Enums.ReactionType>(request.ReactionType),
            CreatedAt = DateTime.UtcNow
        };
    }
}
