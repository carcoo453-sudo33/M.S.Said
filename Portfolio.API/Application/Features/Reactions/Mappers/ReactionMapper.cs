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

    /// <summary>
    /// Creates a new Reaction entity for the specified project using values from the create DTO.
    /// </summary>
    /// <param name="projectId">The identifier of the project the reaction belongs to.</param>
    /// <param name="request">The DTO containing the user identifier and the reaction type string.</param>
    /// <returns>The newly created Reaction entity with a generated Id and current UTC CreatedAt.</returns>
    /// <exception cref="ArgumentException">Thrown when <paramref name="request"/>.ReactionType cannot be parsed as a valid ReactionType enum.</exception>
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



