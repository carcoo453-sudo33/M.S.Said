using FluentValidation.Results;
using Portfolio.API.Features.Reactions.DTOs;

namespace Portfolio.API.Features.Reactions.Validation;

public static class ReactionValidation
{
    public static ValidationResult ValidateCreateRequest(ReactionCreateDto request)
    {
        var result = new ValidationResult();

        if (string.IsNullOrWhiteSpace(request.UserId))
        {
            result.Errors.Add(new ValidationFailure("UserId", "User ID is required"));
        }

        if (string.IsNullOrWhiteSpace(request.ReactionType))
        {
            result.Errors.Add(new ValidationFailure("ReactionType", "Reaction type is required"));
        }
        else if (!IsValidReactionType(request.ReactionType))
        {
            result.Errors.Add(new ValidationFailure("ReactionType", "Invalid reaction type"));
        }

        return result;
    }

    private static bool IsValidReactionType(string reactionType)
    {
        var validTypes = new[] { "Like", "Love", "Wow", "Sad", "Angry" };
        return validTypes.Contains(reactionType, StringComparer.OrdinalIgnoreCase);
    }
}
