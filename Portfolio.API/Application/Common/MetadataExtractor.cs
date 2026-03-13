using System;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
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
    private const string GitHubDomain = "github.com";

    /// <summary>
    /// Initializes a new instance of MetadataExtractor and configures the internal HttpClient with a 10-second timeout and a default User-Agent header.
    /// </summary>
    public MetadataExtractor()
    {
        _httpClient = new HttpClient
        {
            Timeout = TimeSpan.FromSeconds(10)
        };
        _httpClient.DefaultRequestHeaders.UserAgent.ParseAdd("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36");
        _httpClient.DefaultRequestHeaders.Add("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8");
        _httpClient.DefaultRequestHeaders.Add("Accept-Language", "en-US,en;q=0.9");
        _httpClient.DefaultRequestHeaders.Add("Cache-Control", "no-cache");
        _httpClient.DefaultRequestHeaders.Add("Pragma", "no-cache");
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
            var platformType = DetectPlatformType(url);
            var html = await FetchHtmlAsync(url);
            var doc = new HtmlDocument();
            doc.LoadHtml(html);

            var metadata = new Metadata
            {
                PlatformType = platformType
            };

            // Platform-specific extraction FIRST (before common metadata)
            // This ensures GitHub repos get proper title/description from README
            if (platformType == "StackOverflow")
            {
                var question = ExtractStackOverflowQuestion(doc);
                metadata.Title = question.Title;
                metadata.Content = question.Content;
                metadata.Tags = ExtractStackOverflowTags(doc);
            }
            else if (platformType == "Medium")
            {
                metadata.Title = ExtractTitleTag(doc) ?? ExtractMetaTag(doc, "og:title") ?? "Untitled";
                metadata.Description = ExtractMetaTag(doc, "og:description") ?? ExtractMetaTag(doc, "description");
                metadata.Content = ExtractArticleContent(doc);
            }
            else if (platformType == "DevTo")
            {
                metadata.Title = ExtractTitleTag(doc) ?? ExtractMetaTag(doc, "og:title") ?? "Untitled";
                metadata.Description = ExtractMetaTag(doc, "og:description") ?? ExtractMetaTag(doc, "description");
                metadata.Content = ExtractArticleContent(doc);
            }
            else if (platformType == "GitHub")
            {
                // For GitHub, extract from README first, then fall back to HTML metadata
                await ExtractGitHubDataAsync(url, metadata);
                // Only set from HTML if not already set by GitHub extraction
                if (string.IsNullOrEmpty(metadata.Title))
                    metadata.Title = ExtractTitleTag(doc) ?? "Untitled";
                if (string.IsNullOrEmpty(metadata.Description))
                    metadata.Description = ExtractMetaTag(doc, "og:description") ?? ExtractMetaTag(doc, "description");
            }
            else
            {
                // Generic blog/website extraction
                metadata.Title = ExtractTitleTag(doc) ?? ExtractMetaTag(doc, "og:title") ?? "Untitled";
                metadata.Description = ExtractMetaTag(doc, "og:description") ?? ExtractMetaTag(doc, "description");
            }

            // Extract common metadata if not already set
            if (string.IsNullOrEmpty(metadata.ImageUrl))
                metadata.ImageUrl = ExtractMetaTag(doc, "og:image");
            if (string.IsNullOrEmpty(metadata.Author))
                metadata.Author = ExtractMetaTag(doc, "author");

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
        if (host.Equals(GitHubDomain, StringComparison.OrdinalIgnoreCase) ||
            host.EndsWith($".{GitHubDomain}", StringComparison.OrdinalIgnoreCase))
            return "GitHub";

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
    private async Task ExtractGitHubDataAsync(string url, Metadata metadata)
    {
        try
        {
            var match = Regex.Match(url, @"github\.com/([^/]+)/([^/]+)");
            if (!match.Success) return;

            var owner = match.Groups[1].Value;
            var repo = match.Groups[2].Value.Replace(".git", "");
            
            // ALWAYS set title to repository name for GitHub repos
            metadata.Title = repo;
            
            // Try fetching from docs folder (common convention) - Priority 1
            metadata.KeyFeatures = await FetchAndParseListAsync(owner, repo, "docs/key-features.md", line => new Portfolio.API.Application.Features.Projects.DTOs.KeyFeatureCreateDto { Title = line, FeatureType = Portfolio.API.Domain.Enums.FeatureType.Added });
            metadata.Responsibilities = await FetchAndParseListAsync(owner, repo, "docs/responsibilities.md", line => new Portfolio.API.Application.Features.Projects.DTOs.ResponsibilityCreateDto { Title = line });
            metadata.Changelog = await FetchAndParseChangelogAsync(owner, repo, "docs/changelog.md");

            // Fallback/Enhance with README.md - Priority 2
            await ExtractFromReadmeAsync(owner, repo, metadata);
        }
        catch (Exception ex)
        {
            // Don't fail the whole import if docs sync fails
            System.Diagnostics.Debug.WriteLine($"GitHub docs sync failed: {ex.Message}");
        }
    }

    private async Task ExtractFromReadmeAsync(string owner, string repo, Metadata metadata)
    {
        var readme = await FetchRawGitHubContentAsync(owner, repo, "README.md") 
                   ?? await FetchRawGitHubContentAsync(owner, repo, "readme.md")
                   ?? await FetchRawGitHubContentAsync(owner, repo, "README.MD");

        if (string.IsNullOrEmpty(readme)) return;

        // 1. Extract Title (First # header) - only if not already set
        if (string.IsNullOrEmpty(metadata.Title) || metadata.Title == "Untitled")
        {
            var titleMatch = Regex.Match(readme, @"^#\s+(.+)$", RegexOptions.Multiline);
            if (titleMatch.Success)
            {
                metadata.Title = titleMatch.Groups[1].Value.Trim();
            }
        }

        // 2. Extract Description (First paragraph after title, before any ## headers or code blocks)
        // This gets just the intro paragraph, not the entire content
        if (string.IsNullOrEmpty(metadata.Description))
        {
            // Match content between first # and first ## or code block
            var descriptionMatch = Regex.Match(readme, @"^#\s+.+?\n\n?([^\n#`]+(?:\n(?!##|```)[^\n#`]+)*)", RegexOptions.Multiline);
            if (descriptionMatch.Success)
            {
                var extractedDesc = descriptionMatch.Groups[1].Value.Trim();
                // Clean up the description - remove extra whitespace and limit length
                extractedDesc = Regex.Replace(extractedDesc, @"\s+", " ");
                if (extractedDesc.Length > 500) 
                    extractedDesc = extractedDesc.Substring(0, 497) + "...";
                
                metadata.Description = extractedDesc;
            }
        }

        // 3. Extract Tags/Tech Stack
        if (string.IsNullOrEmpty(metadata.Tags))
        {
            var techSectionMatch = Regex.Match(readme, @"#+\s+(?:Tech Stack|Technologies|Built With|Stack|Tools)[\s\S]+?(?=\n#|$)", RegexOptions.IgnoreCase);
            if (techSectionMatch.Success)
            {
                var techContent = techSectionMatch.Value;
                var items = Regex.Matches(techContent, @"[-*]\s+([^\n]+)").Cast<Match>().Select(m => m.Groups[1].Value.Trim()).ToList();
                if (items.Any()) metadata.Tags = string.Join(", ", items);
            }
        }

        // 4. Extract Key Features (if not found in docs/)
        if (metadata.KeyFeatures.Count == 0)
        {
            var featuresSectionMatch = Regex.Match(readme, @"#+\s+(?:Features|Key Features|Capability)[\s\S]+?(?=\n#|$)", RegexOptions.IgnoreCase);
            if (featuresSectionMatch.Success)
            {
                var items = Regex.Matches(featuresSectionMatch.Value, @"[-*]\s+([^\n]+)").Cast<Match>().Select(m => m.Groups[1].Value.Trim()).ToList();
                metadata.KeyFeatures = items.Select(title => new Portfolio.API.Application.Features.Projects.DTOs.KeyFeatureCreateDto { Title = title, FeatureType = Portfolio.API.Domain.Enums.FeatureType.Added }).ToList();
            }
        }

        // 5. Extract Responsibilities (heuristic: look for Role/Responsibility)
        if (metadata.Responsibilities.Count == 0)
        {
            var respSectionMatch = Regex.Match(readme, @"#+\s+(?:Responsibilities|My Role|Contribution)[\s\S]+?(?=\n#|$)", RegexOptions.IgnoreCase);
            if (respSectionMatch.Success)
            {
                var items = Regex.Matches(respSectionMatch.Value, @"[-*]\s+([^\n]+)").Cast<Match>().Select(m => m.Groups[1].Value.Trim()).ToList();
                metadata.Responsibilities = items.Select(title => new Portfolio.API.Application.Features.Projects.DTOs.ResponsibilityCreateDto { Title = title }).ToList();
            }
        }

        // 6. Extract Category/Niche (heuristic from content)
        if (string.IsNullOrEmpty(metadata.Category))
        {
            if (readme.Contains("Web App", StringComparison.OrdinalIgnoreCase) || readme.Contains("Dashboard", StringComparison.OrdinalIgnoreCase)) metadata.Category = "WebDevelopment";
            else if (readme.Contains("Mobile App", StringComparison.OrdinalIgnoreCase) || readme.Contains("Android", StringComparison.OrdinalIgnoreCase) || readme.Contains("iOS", StringComparison.OrdinalIgnoreCase)) metadata.Category = "MobileDevelopment";
            else if (readme.Contains("API", StringComparison.OrdinalIgnoreCase) || readme.Contains("Backend", StringComparison.OrdinalIgnoreCase)) metadata.Category = "ApiDevelopment";
            else if (readme.Contains("UI", StringComparison.OrdinalIgnoreCase) || readme.Contains("Design", StringComparison.OrdinalIgnoreCase)) metadata.Category = "UiUxDesign";
        }

        if (string.IsNullOrEmpty(metadata.Niche))
        {
            if (readme.Contains("E-commerce", StringComparison.OrdinalIgnoreCase) || readme.Contains("Shop", StringComparison.OrdinalIgnoreCase)) metadata.Niche = "E-commerce";
            else if (readme.Contains("Finance", StringComparison.OrdinalIgnoreCase) || readme.Contains("Bank", StringComparison.OrdinalIgnoreCase)) metadata.Niche = "FinTech";
            else if (readme.Contains("Education", StringComparison.OrdinalIgnoreCase) || readme.Contains("Learning", StringComparison.OrdinalIgnoreCase)) metadata.Niche = "EdTech";
            else if (readme.Contains("Social", StringComparison.OrdinalIgnoreCase) || readme.Contains("Chat", StringComparison.OrdinalIgnoreCase)) metadata.Niche = "Social Media";
        }
    }

    private async Task<List<T>> FetchAndParseListAsync<T>(string owner, string repo, string path, Func<string, T> mapper)
    {
        var list = new List<T>();
        try
        {
            var content = await FetchRawGitHubContentAsync(owner, repo, path);
            if (string.IsNullOrEmpty(content)) return list;

            var lines = content.Split('\n', StringSplitOptions.RemoveEmptyEntries);
            foreach (var line in lines)
            {
                var trimmed = line.Trim();
                if (trimmed.StartsWith("- ") || trimmed.StartsWith("* "))
                {
                    list.Add(mapper(trimmed.Substring(2).Trim()));
                }
                else if (!string.IsNullOrWhiteSpace(trimmed) && !trimmed.StartsWith("#"))
                {
                    list.Add(mapper(trimmed));
                }
            }
        }
        catch { /* Ignore fetch errors for optional docs */ }
        return list;
    }

    private async Task<List<Portfolio.API.Application.Features.Projects.DTOs.ChangelogItemCreateDto>> FetchAndParseChangelogAsync(string owner, string repo, string path)
    {
        var changelog = new List<Portfolio.API.Application.Features.Projects.DTOs.ChangelogItemCreateDto>();
        try
        {
            var content = await FetchRawGitHubContentAsync(owner, repo, path);
            if (string.IsNullOrEmpty(content)) return changelog;

            var sections = content.Split(new[] { "\n## " }, StringSplitOptions.RemoveEmptyEntries);
            foreach (var section in sections)
            {
                var lines = section.Split('\n');
                var titleLine = lines[0].Trim();
                
                // Try to extract version and date e.g. "v1.0.0 (2024-01-01)"
                var versionMatch = Regex.Match(titleLine, @"v?(\d+\.\d+\.\d+)");
                var dateMatch = Regex.Match(titleLine, @"(\d{4}-\d{2}-\d{2})");

                var item = new Portfolio.API.Application.Features.Projects.DTOs.ChangelogItemCreateDto
                {
                    Version = versionMatch.Success ? versionMatch.Groups[1].Value : "1.0.0",
                    Date = dateMatch.Success ? dateMatch.Groups[1].Value : DateTime.UtcNow.ToString("yyyy-MM-dd"),
                    Title = titleLine,
                    Description = string.Join("\n", lines.Skip(1).Select(l => l.Trim()).Where(l => !string.IsNullOrEmpty(l)))
                };
                changelog.Add(item);
            }
        }
        catch { /* Ignore fetch errors */ }
        return changelog;
    }

    private async Task<string?> FetchRawGitHubContentAsync(string owner, string repo, string path)
    {
        // Try main branch first, then master
        var branches = new[] { "main", "master" };
        foreach (var branch in branches)
        {
            try
            {
                var url = $"https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{path}";
                using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));
                var response = await _httpClient.GetAsync(url, cts.Token);
                if (response.IsSuccessStatusCode)
                {
                    return await response.Content.ReadAsStringAsync();
                }
            }
            catch { continue; }
        }
        return null;
    }

    private async Task<string> FetchHtmlAsync(string url)
    {
        try
        {
            using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(8));
            
            // Add common browser headers for LinkedIn
            if (DetectPlatformType(url) == "LinkedIn")
            {
                _httpClient.DefaultRequestHeaders.Referrer = new Uri("https://www.google.com/"); // Common referrer
                _httpClient.DefaultRequestHeaders.Add("Sec-Fetch-Dest", "document");
                _httpClient.DefaultRequestHeaders.Add("Sec-Fetch-Mode", "navigate");
                _httpClient.DefaultRequestHeaders.Add("Sec-Fetch-Site", "none");
                _httpClient.DefaultRequestHeaders.Add("Sec-Fetch-User", "?1");
                _httpClient.DefaultRequestHeaders.Add("Upgrade-Insecure-Requests", "1");
                _httpClient.DefaultRequestHeaders.UserAgent.ParseAdd("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
            }

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
