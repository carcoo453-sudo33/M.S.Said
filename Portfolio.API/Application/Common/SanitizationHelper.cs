using HtmlAgilityPack;

namespace Portfolio.API.Helpers;

public static class SanitizationHelper
{
    /// <summary>
    /// Strips all HTML tags from the input string and returns plain text.
<<<<<<< HEAD
    /// </summary>
=======
    /// <summary>
    /// Convert HTML content to plain text by removing tags and decoding HTML entities.
    /// </summary>
    /// <param name="input">The HTML string to sanitize; may be null.</param>
    /// <returns>Plain text with HTML tags removed and HTML entities decoded; empty string if <paramref name="input"/> is null, empty, or whitespace.</returns>
>>>>>>> origin/master
    public static string Sanitize(string? input)
    {
        if (string.IsNullOrWhiteSpace(input))
            return string.Empty;

        var htmlDoc = new HtmlDocument();
        htmlDoc.LoadHtml(input);

        // DeEntitize converts HTML entities (like &amp;) back to their literal counterparts
        return HtmlEntity.DeEntitize(htmlDoc.DocumentNode.InnerText).Trim();
    }
}
