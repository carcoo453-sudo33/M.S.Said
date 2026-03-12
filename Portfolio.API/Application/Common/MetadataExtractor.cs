using System;
using System.Net.Http;
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

    /// <summary>
    /// Initializes a new instance of MetadataExtractor and configures the internal HttpClient with a 10-second timeout and a default User-Agent header.
    /// </summary>
    public MetadataExtractor()
    {
        _httpClient = new HttpClient
        {
            Timeout = TimeSpan.FromSeconds(10)
        };
        _httpClient.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");
    }

    /// <summary>
    /// Extracts page metadata from the specified URL and returns a populated Metadata instance.
    /// </summary>
    /// <param name="url">The absolute HTTP or HTTPS URL of the page to extract metadata from. Must not point to loopback or private addresses.</param>
    /// <returns>
    /// A Metadata object populated with detected PlatformType and common fields: Title, Description, ImageUrl, Author;
    /// platform-specific Content and Tags when available; and PublishedDate when present in the page.
    /// </returns>
    /// <exception cref="TimeoutException">Thrown when the HTTP request to fetch the page times out.</exception>
    /// <exception cref="InvalidOperationException">Thrown when metadata extraction fails for reasons other than a timeout; the original exception is provided as the inner exception.</exception>
    public async Task<Metadata> ExtractMetadata(string url)
    {
        ValidateUrl(url);
        try
        {
            var platformType = MetadataExtractor.DetectPlatformType(url);
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
        catch (TimeoutException)
        {
            throw;
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Failed to extract metadata from URL: {url}", ex);
        }
    }

    /// <summary>
    /// Determines the platform type represented by the given URL.
    /// </summary>
    /// <param name="url">The URL to classify; may be any string. If the URL is not a valid absolute URI or the host is not recognized, the method treats it as a generic blog.</param>
    /// <returns>The platform name: "StackOverflow", "Medium", "DevTo", "LinkedIn", or "Blog" when the host is unrecognized or the URL is invalid.</returns>
    public static string DetectPlatformType(string url)
    {
        if (!Uri.TryCreate(url, UriKind.Absolute, out var uri))
            return "Blog";

        var host = uri.Host;

        if (host.Equals(StackOverflowDomain, StringComparison.OrdinalIgnoreCase) ||
            host.EndsWith($".{StackOverflowDomain}", StringComparison.OrdinalIgnoreCase))
            return "StackOverflow";
        if (host.Equals(MediumDomain, StringComparison.OrdinalIgnoreCase) ||
            host.EndsWith($".{MediumDomain}", StringComparison.OrdinalIgnoreCase))
            return "Medium";
        if (host.Equals(DevToDomain, StringComparison.OrdinalIgnoreCase) ||
            host.EndsWith($".{DevToDomain}", StringComparison.OrdinalIgnoreCase))
            return "DevTo";
        if (host.Equals(LinkedInDomain, StringComparison.OrdinalIgnoreCase) ||
            host.EndsWith($".{LinkedInDomain}", StringComparison.OrdinalIgnoreCase))
            return "LinkedIn";

        return "Blog";
    }

    /// <summary>
    /// Retrieve the value of a meta tag's content attribute that matches the given property or name.
    /// </summary>
    /// <param name="doc">The HTML document to search.</param>
    /// <param name="tagName">The meta tag property or name to match (for example, "og:title" or "description").</param>
    /// <returns>The content attribute value of the matching meta tag, or <c>null</c> if none is found.</returns>
    public string? ExtractMetaTag(HtmlDocument doc, string tagName)
    {
        var node = doc.DocumentNode.SelectSingleNode($"//meta[@property='{tagName}' or @name='{tagName}']");
        return node?.GetAttributeValue("content", null);
    }

    /// <summary>
    /// Retrieves the document's &lt;title&gt; text.
    /// </summary>
    /// <param name="doc">The parsed HTML document to read the title from.</param>
    /// <returns>The trimmed text content of the &lt;title&gt; element, or <c>null</c> if no title element exists.</returns>
    public string? ExtractTitleTag(HtmlDocument doc)
    {
        var node = doc.DocumentNode.SelectSingleNode("//title");
        return node?.InnerText?.Trim();
    }

    /// <summary>
    /// Extracts the question title and body content from a Stack Overflow question page.
    /// </summary>
    /// <param name="doc">An HtmlDocument representing the Stack Overflow question page HTML.</param>
    /// <returns>A tuple where `Title` is the question title (defaults to "Untitled" if not found) and `Content` is the question body text (empty string if not found).</returns>
    public (string Title, string Content) ExtractStackOverflowQuestion(HtmlDocument doc)
    {
        var titleNode = doc.DocumentNode.SelectSingleNode("//h1[@class='s-heading--large']");
        var title = titleNode?.InnerText?.Trim() ?? "Untitled";

        var contentNode = doc.DocumentNode.SelectSingleNode("//div[@class='s-prose js-post-body']");
        var content = contentNode?.InnerText?.Trim() ?? string.Empty;

        return (title, content);
    }

    /// <summary>
    /// Extracts tag names from a StackOverflow question page and returns them as a single comma-separated string.
    /// </summary>
    /// <param name="doc">An HtmlDocument representing the parsed StackOverflow question HTML.</param>
    /// <returns>A comma-separated list of tag names (e.g., "c#,asp.net"), or <c>null</c> if no tags are found.</returns>
    public string? ExtractStackOverflowTags(HtmlDocument doc)
    {
        var tagNodes = doc.DocumentNode.SelectNodes("//a[@class='post-tag']");
        if (tagNodes == null || tagNodes.Count == 0)
            return null;

        var tags = tagNodes.Select(n => n.InnerText?.Trim()).Where(t => !string.IsNullOrEmpty(t));
        return string.Join(", ", tags);
    }

    /// <summary>
    /// Extracts the main article text from common content containers in the HTML document.
    /// </summary>
    /// <returns>The trimmed text content found in an &lt;article&gt;, &lt;main&gt;, or &lt;div class="post-content"&gt; element, or an empty string if no such element is present.</returns>
    private string ExtractArticleContent(HtmlDocument doc)
    {
        var contentNode = doc.DocumentNode.SelectSingleNode("//article") 
            ?? doc.DocumentNode.SelectSingleNode("//main")
            ?? doc.DocumentNode.SelectSingleNode("//div[@class='post-content']");

        return contentNode?.InnerText?.Trim() ?? string.Empty;
    }

    /// <summary>
    /// Extracts the published date of the document from common article metadata.
    /// </summary>
    /// <remarks>
    /// The method looks for a meta tag with property "article:published_time" or a &lt;time&gt; element with a datetime attribute and parses its value to a DateTime.
    /// </remarks>
    /// <returns>The parsed published date as a DateTime, or null if no valid date is found.</returns>
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

    /// <summary>
    /// Validates that the provided URL is an absolute HTTP or HTTPS URI and is not a loopback, link-local, or private address.
    /// </summary>
    /// <param name="url">The URL to validate.</param>
    /// <exception cref="ArgumentException">Thrown when the URL is malformed, uses a non-HTTP(S) scheme, or targets a loopback/link-local/private host.</exception>
    private void ValidateUrl(string url)
    {
        if (!Uri.TryCreate(url, UriKind.Absolute, out var uri))
            throw new ArgumentException("Invalid URL format");

        if (uri.Scheme != Uri.UriSchemeHttp && uri.Scheme != Uri.UriSchemeHttps)
            throw new ArgumentException("Only HTTP and HTTPS schemes are allowed");

        var host = uri.Host.ToLower();

        // Block loopback, private, and link-local addresses
        if (host == "localhost" || host == "127.0.0.1" || host == "::1")
            throw new ArgumentException("Loopback addresses are not allowed");

        if (IsPrivateIP(host))
            throw new ArgumentException("Private IP addresses are not allowed");
    }

    /// <summary>
    /// Determines whether the given host or IP string represents a private, link-local, or local-name address.
    /// </summary>
    /// <param name="host">The host name or IPv4 address string to evaluate (e.g., "192.168.1.1", "example.local").</param>
    /// <returns>`true` if the host is in a private IPv4 range (10.*, 172.16.*–172.31.*, 192.168.*), the link-local range (169.254.*), or ends with ".local"; `false` otherwise.</returns>
    private bool IsPrivateIP(string host)
    {
        if (host.StartsWith("10.") || 
            host.StartsWith("192.168.") || 
            host.StartsWith("169.254.") ||
            host.EndsWith(".local"))
            return true;

        // Check 172.16.0.0/12 range (172.16.x.x - 172.31.x.x)
        if (host.StartsWith("172."))
        {
            var parts = host.Split('.');
            if (parts.Length >= 2 && int.TryParse(parts[1], out var second))
                return second >= 16 && second <= 31;
        }
        return false;
    }
    /// <summary>
    /// Fetches the HTML content from the specified URL using a short (8 second) request timeout.
    /// </summary>
    /// <param name="url">The absolute HTTP/HTTPS URL to retrieve.</param>
    /// <returns>The response body as a string.</returns>
    /// <exception cref="TimeoutException">Thrown when the request exceeds the configured timeout.</exception>
    /// <exception cref="InvalidOperationException">Thrown when the HTTP request fails; the inner exception contains the original <see cref="HttpRequestException"/>.</exception>
    private async Task<string> FetchHtmlAsync(string url)
    {
        try
        {
            using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(8));
            var response = await _httpClient.GetAsync(url, cts.Token);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync();
        }
        catch (OperationCanceledException)
        {
            throw new TimeoutException($"Request to {url} timed out");
        }
        catch (HttpRequestException ex)
        {
            throw new InvalidOperationException($"Failed to fetch URL: {url}", ex);
        }
    }
}
