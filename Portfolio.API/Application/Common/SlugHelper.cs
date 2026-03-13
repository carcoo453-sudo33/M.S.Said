using System.Text.RegularExpressions;

namespace Portfolio.API.Helpers;

public static class SlugHelper
{
    public static string GenerateSlug(string title)
    {
        if (string.IsNullOrWhiteSpace(title))
            return string.Empty;

        // Convert to lowercase and replace spaces and special characters
        var slug = title.ToLower()
            .Replace(" ", "-")
            .Replace("/", "-")
            .Replace("\\", "-")
            .Replace(".", "-")
            .Replace("_", "-");

        // Remove any remaining special characters except letters, numbers, and dashes
        slug = Regex.Replace(slug, "[^a-z0-9-]", "");

        // Remove multiple consecutive dashes
        slug = Regex.Replace(slug, "-+", "-");

        // Remove leading and trailing dashes
        slug = slug.Trim('-');

        return slug;
    }

    public static bool IsValidSlug(string slug)
    {
        if (string.IsNullOrWhiteSpace(slug))
            return false;

        // Check if slug contains only lowercase letters, numbers, and dashes
        return Regex.IsMatch(slug, "^[a-z0-9-]+$");
    }
}