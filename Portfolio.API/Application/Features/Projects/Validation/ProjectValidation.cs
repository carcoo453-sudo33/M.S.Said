using Portfolio.API.Application.Features.Projects.DTOs;
using Portfolio.API.Helpers;

namespace Portfolio.API.Application.Features.Projects.Validation;

public static class ProjectValidation
{
    /// <summary>
    /// Validate a project creation request and collect any validation errors.
    /// </summary>
    /// <param name="request">The project creation DTO to validate; may be null (a null value will add a "Request body is required" error).</param>
    /// <returns>A ValidationResult whose Errors list contains messages for each failed check and whose IsValid is true when no errors were added.</returns>
    public static ValidationResult ValidateCreateRequest(ProjectCreateDto request)
    {
        var result = new ValidationResult();

        if (request == null)
        {
            result.AddError("Request body is required");
            return result;
        }

        // Title validation
        if (!ValidationHelper.IsRequired(request.Title))
            result.AddError("Project title is required");
        else if (!ValidationHelper.IsWithinLength(request.Title, 200))
            result.AddError("Project title must be less than 200 characters");

        // Description validation
        if (!ValidationHelper.IsWithinLength(request.Description, 2000))
            result.AddError("Project description must be less than 2000 characters");

        // URL validations
        if (!string.IsNullOrEmpty(request.ProjectUrl) && !UrlHelper.IsValidUrl(request.ProjectUrl))
            result.AddError("Invalid project URL format");

        if (!string.IsNullOrEmpty(request.GitHubUrl) && !UrlHelper.IsValidGitHubUrl(request.GitHubUrl))
            result.AddError("Invalid GitHub URL format");

        if (!string.IsNullOrEmpty(request.ImageUrl) && !UrlHelper.IsValidUrl(request.ImageUrl))
            result.AddError("Invalid image URL format");

        // Validate individual project images
        if (request.Images != null)
        {
            foreach (var image in request.Images)
            {
                if (!string.IsNullOrEmpty(image.ImageUrl) && !UrlHelper.IsValidUrl(image.ImageUrl))
                {
                    result.AddError($"Invalid image URL format in images list: {image.ImageUrl}");
                }
            }
        }

        return result;
    }

    /// <summary>
    /// Validates a project update request, ensuring the request body and fields meet constraints and that an ID is provided.
    /// </summary>
    /// <param name="request">The project update DTO to validate.</param>
    /// <returns>A <see cref="ValidationResult"/> containing any validation errors; <see cref="ValidationResult.IsValid"/> is true when no errors are present.</returns>
    public static ValidationResult ValidateUpdateRequest(ProjectUpdateDto request)
    {
        if (request == null)
        {
            var errorResult = new ValidationResult();
            errorResult.AddError("Request body is required");
            return errorResult;
        }

        var result = ValidateCreateRequest(request);

        if (request.Id == Guid.Empty)
            result.AddError("Project ID is required for update");

        return result;
    }
}

public class ValidationResult
{
    public bool IsValid => !Errors.Any();
    public List<string> Errors { get; } = new();

    public void AddError(string error)
    {
        Errors.Add(error);
    }

    /// <summary>
    /// Appends multiple error messages to the result's error collection.
    /// </summary>
    /// <param name="errors">The error messages to add; each string is appended in order.</param>
    public void AddErrors(IEnumerable<string> errors)
    {
        Errors.AddRange(errors);
    }
}


