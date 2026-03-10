using Portfolio.API.Features.Comments.DTOs;
using Portfolio.API.Helpers;

namespace Portfolio.API.Features.Comments.Validation;

public static class CommentValidation
{
    public static ValidationResult ValidateComment(CommentCreateDto request)
    {
        var result = new ValidationResult();

        // Author validation
        if (!ValidationHelper.IsRequired(request.Author))
            result.AddError("Author name is required");
        else if (!ValidationHelper.IsWithinLength(request.Author, 100))
            result.AddError("Author name must be less than 100 characters");

        // Content validation
        if (!ValidationHelper.IsRequired(request.Content))
            result.AddError("Comment content is required");
        else if (!ValidationHelper.IsWithinLength(request.Content, 1000))
            result.AddError("Comment must be less than 1000 characters");
        else if (ValidationHelper.ContainsSpamPatterns(request.Content))
            result.AddError("Comment contains suspicious content");

        // Avatar URL validation (optional)
        if (!string.IsNullOrEmpty(request.AvatarUrl) && !UrlHelper.IsValidUrl(request.AvatarUrl))
            result.AddError("Invalid avatar URL format");

        return result;
    }
}
