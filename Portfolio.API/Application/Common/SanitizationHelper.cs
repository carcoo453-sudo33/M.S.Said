using HtmlAgilityPack;

namespace Portfolio.API.Helpers;

public static class SanitizationHelper
{
    /// <summary>
    /// Strips all HTML tags from the input string and returns plain text.
    /// </summary>
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
