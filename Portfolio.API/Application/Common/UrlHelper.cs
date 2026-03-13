using System.Text.RegularExpressions;

namespace Portfolio.API.Helpers;

public static class UrlHelper
{
    public static bool IsValidUrl(string url)
    {
        if (string.IsNullOrWhiteSpace(url))
            return false;

        // Allow relative URLs starting with / (specifically for /uploads/...)
        if (url.StartsWith("/") || url.StartsWith("~"))
            return true;

        return Uri.TryCreate(url, UriKind.Absolute, out var result) &&
               (result.Scheme == Uri.UriSchemeHttp || result.Scheme == Uri.UriSchemeHttps);
    }

    public static bool IsValidGitHubUrl(string url)
    {
        if (!IsValidUrl(url)) 
            return false;

        var githubRegex = new Regex(@"^https://github\.com/[\w\-\.]+/[\w\-\.]+/?$", RegexOptions.IgnoreCase);
        return githubRegex.IsMatch(url);
    }

    public static bool IsValidImageUrl(string url)
    {
        if (!IsValidUrl(url)) 
            return false;

        var imageExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg" };
        var uri = new Uri(url);
        return imageExtensions.Any(ext => uri.AbsolutePath.EndsWith(ext, StringComparison.OrdinalIgnoreCase));
    }
}