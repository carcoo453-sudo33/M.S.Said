using System.Text.RegularExpressions;
using HtmlAgilityPack;

namespace Portfolio.API.Application.Common;

/// <summary>
/// Extracts metadata from URLs for various platforms
/// Supports: StackOverflow, Medium, Dev.to, LinkedIn, and generic blogs
/// </summary>
public class MetadataExtractor
{
    private readonly HttpClient _httpClient;
    private const string StackOverflowDomain = "stackoverflow.com";
    private const string MediumDomain = "medium.com";
    private const string DevToDomain = "dev.to";
    private const string LinkedInDomain = "linkedin.com";

    public MetadataExtractor()
    {
        _httpClient = new HttpClient();
        _httpClient.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");
    }

    public async Task<Metadata> ExtractMetadata(string url)
    {
        try
        {
            var platformType = DetectPlatformType(url);
            var html = await FetchHtmlAsync(url);
            var doc = new HtmlDocument();
            doc.LoadHtml(html);

            var metadata = new Metadata
            {
                PlatformType = platformType
            };

            // Extract common metadata
            metadata.Title = ExtractTitleTag(doc) ?? ExtractMetaTag(doc, "og:title") ?? "Untitled";
            metadata.Description = ExtractMetaTag(doc, "og:description") ?? ExtractMetaTag(doc, "description");
            metadata.ImageUrl = ExtractMetaTag(doc, "og:image");
            metadata.Author = ExtractMetaTag(doc, "author");

            // Platform-specific extraction
            if (platformType == "StackOverflow")
            {
                var question = ExtractStackOverflowQuestion(doc);
                metadata.Title = question.Title;
                metadata.Content = question.Content;
                metadata.Tags = ExtractStackOverflowTags(doc);
            }
            else if (platformType == "Medium")
            {
                metadata.Content = ExtractArticleContent(doc);
            }
            else if (platformType == "DevTo")
            {
                metadata.Content = ExtractArticleContent(doc);
            }

            // Try to extract published date
            metadata.PublishedDate = ExtractPublishedDate(doc);

            return metadata;
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Failed to extract metadata from URL: {url}", ex);
        }
    }

    public string DetectPlatformType(string url)
    {
        if (url.Contains(StackOverflowDomain, StringComparison.OrdinalIgnoreCase))
            return "StackOverflow";
        if (url.Contains(MediumDomain, StringComparison.OrdinalIgnoreCase))
            return "Medium";
        if (url.Contains(DevToDomain, StringComparison.OrdinalIgnoreCase))
            return "DevTo";
        if (url.Contains(LinkedInDomain, StringComparison.OrdinalIgnoreCase))
            return "LinkedIn";

        return "Blog";
    }

    public string? ExtractMetaTag(HtmlDocument doc, string tagName)
    {
        var node = doc.DocumentNode.SelectSingleNode($"//meta[@property='{tagName}' or @name='{tagName}']");
        return node?.GetAttributeValue("content", null);
    }

    public string? ExtractTitleTag(HtmlDocument doc)
    {
        var node = doc.DocumentNode.SelectSingleNode("//title");
        return node?.InnerText?.Trim();
    }

    public (string Title, string Content) ExtractStackOverflowQuestion(HtmlDocument doc)
    {
        var titleNode = doc.DocumentNode.SelectSingleNode("//h1[@class='s-heading--large']");
        var title = titleNode?.InnerText?.Trim() ?? "Untitled";

        var contentNode = doc.DocumentNode.SelectSingleNode("//div[@class='s-prose js-post-body']");
        var content = contentNode?.InnerText?.Trim() ?? string.Empty;

        return (title, content);
    }

    public string? ExtractStackOverflowTags(HtmlDocument doc)
    {
        var tagNodes = doc.DocumentNode.SelectNodes("//a[@class='post-tag']");
        if (tagNodes == null || tagNodes.Count == 0)
            return null;

        var tags = tagNodes.Select(n => n.InnerText?.Trim()).Where(t => !string.IsNullOrEmpty(t));
        return string.Join(", ", tags);
    }

    private string ExtractArticleContent(HtmlDocument doc)
    {
        var contentNode = doc.DocumentNode.SelectSingleNode("//article") 
            ?? doc.DocumentNode.SelectSingleNode("//main")
            ?? doc.DocumentNode.SelectSingleNode("//div[@class='post-content']");

        return contentNode?.InnerText?.Trim() ?? string.Empty;
    }

    private DateTime? ExtractPublishedDate(HtmlDocument doc)
    {
        var dateNode = doc.DocumentNode.SelectSingleNode("//meta[@property='article:published_time']");
        var dateStr = dateNode?.GetAttributeValue("content", null);

        if (string.IsNullOrEmpty(dateStr))
        {
            dateNode = doc.DocumentNode.SelectSingleNode("//time");
            dateStr = dateNode?.GetAttributeValue("datetime", null);
        }

        if (DateTime.TryParse(dateStr, out var date))
            return date;

        return null;
    }

    private async Task<string> FetchHtmlAsync(string url)
    {
        try
        {
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync();
        }
        catch (HttpRequestException ex)
        {
            throw new InvalidOperationException($"Failed to fetch URL: {url}", ex);
        }
    }
}
