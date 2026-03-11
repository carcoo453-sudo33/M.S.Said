using FluentValidation.Results;
using Portfolio.API.Application.Features.Comments.DTOs;
using Portfolio.API.Helpers;

namespace Portfolio.API.Application.Features.Comments.Validation;

public static class CommentValidation
{
    /// <summary>
    /// Validates a comment DTO and collects any field-specific validation failures.
    /// </summary>
    /// <param name="request">The comment data to validate (author, content, optional avatar URL).</param>
    /// <returns>A <see cref="ValidationResult"/> containing zero or more <see cref="ValidationFailure"/> entries for invalid fields.</returns>
    public static ValidationResult ValidateComment(CommentCreateDto request)
    {
        var result = new ValidationResult();

        // Author validation
        if (!ValidationHelper.IsRequired(request.Author))
            result.Errors.Add(new ValidationFailure("Author", "Author name is required"));
        else if (!ValidationHelper.IsWithinLength(request.Author, 100))
            result.Errors.Add(new ValidationFailure("Author", "Author name must be less than 100 characters"));

        // Content validation
        if (!ValidationHelper.IsRequired(request.Content))
            result.Errors.Add(new ValidationFailure("Content", "Comment content is required"));
        else if (!ValidationHelper.IsWithinLength(request.Content, 1000))
            result.Errors.Add(new ValidationFailure("Content", "Comment must be less than 1000 characters"));
        else if (ValidationHelper.ContainsSpamPatterns(request.Content))
            result.Errors.Add(new ValidationFailure("Content", "Comment contains suspicious content"));

        // Avatar URL validation (optional)
        if (!string.IsNullOrEmpty(request.AvatarUrl) && !UrlHelper.IsValidUrl(request.AvatarUrl))
            result.Errors.Add(new ValidationFailure("AvatarUrl", "Invalid avatar URL format"));

        return result;
    }
}



