using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.API.Entities;
using Portfolio.API.Repositories;
using Portfolio.API.DTOs;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BlogController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public BlogController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BlogPost>>> GetPosts()
    {
        var posts = await _unitOfWork.Repository<BlogPost>().GetAllAsync();
        return Ok(posts.OrderByDescending(b => b.PublishedAt));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<BlogPost>> GetPost(Guid id)
    {
        var post = await _unitOfWork.Repository<BlogPost>().GetByIdAsync(id);
        if (post == null) return NotFound();
        return Ok(post);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<BlogPost>> CreatePost(BlogPostDto dto)
    {
        var entry = new BlogPost
        {
            Id = dto.Id != Guid.Empty ? dto.Id : Guid.NewGuid(),
            Title = dto.Title,
            Title_Ar = dto.Title_Ar,
            Summary = dto.Summary,
            Summary_Ar = dto.Summary_Ar,
            Content = dto.Content,
            Content_Ar = dto.Content_Ar,
            ImageUrl = dto.ImageUrl,
            SocialUrl = dto.SocialUrl,
            SocialType = dto.SocialType,
            PublishedAt = dto.PublishedAt != default ? dto.PublishedAt : DateTime.UtcNow,
            Tags = dto.Tags,
            Tags_Ar = dto.Tags_Ar,
            Author = dto.Author,
            LikesCount = dto.LikesCount,
            CommentsCount = dto.CommentsCount,
            StarsCount = dto.StarsCount,
            ForksCount = dto.ForksCount,
            Version = dto.Version
        };
        await _unitOfWork.Repository<BlogPost>().AddAsync(entry);
        await _unitOfWork.CompleteAsync();
        return CreatedAtAction(nameof(GetPost), new { id = entry.Id }, entry);
    }

    [Authorize]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdatePost(Guid id, BlogPostDto dto)
    {
        var repository = _unitOfWork.Repository<BlogPost>();
        var post = await repository.GetByIdAsync(id);
        
        if (post == null) return NotFound();

        post.Title = dto.Title;
        post.Title_Ar = dto.Title_Ar;
        post.Summary = dto.Summary;
        post.Summary_Ar = dto.Summary_Ar;
        post.Content = dto.Content;
        post.Content_Ar = dto.Content_Ar;
        post.ImageUrl = dto.ImageUrl;
        post.SocialUrl = dto.SocialUrl;
        post.SocialType = dto.SocialType;
        post.PublishedAt = dto.PublishedAt != default ? dto.PublishedAt : post.PublishedAt;
        post.Tags = dto.Tags;
        post.Tags_Ar = dto.Tags_Ar;
        post.Author = dto.Author;
        post.LikesCount = dto.LikesCount;
        post.CommentsCount = dto.CommentsCount;
        post.StarsCount = dto.StarsCount;
        post.ForksCount = dto.ForksCount;
        post.Version = dto.Version;
        post.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.CompleteAsync();
        return Ok(post);
    }

    [Authorize]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeletePost(Guid id)
    {
        var entry = await _unitOfWork.Repository<BlogPost>().GetByIdAsync(id);
        if (entry == null) return NotFound();
        _unitOfWork.Repository<BlogPost>().Delete(entry);
        await _unitOfWork.CompleteAsync();
        return NoContent();
    }

    [Authorize]
    [HttpPost("import-from-url")]
    public async Task<ActionResult<BlogPostDto>> ImportFromUrl([FromBody] ImportUrlRequest request)
    {
        try
        {
            var httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");
            
            var response = await httpClient.GetAsync(request.Url);
            var html = await response.Content.ReadAsStringAsync();

            // Detect platform type
            string platformType = DetectPlatformType(request.Url);
            
            // Extract metadata from HTML
            var metadata = ExtractMetadata(html, platformType);
            
            var dto = new BlogPostDto
            {
                Id = Guid.Empty,
                Title = metadata.Title ?? "Untitled Post",
                Summary = metadata.Description ?? "",
                Content = metadata.Content ?? metadata.Description ?? "",
                ImageUrl = metadata.ImageUrl,
                SocialUrl = request.Url,
                SocialType = platformType,
                PublishedAt = metadata.PublishedDate ?? DateTime.UtcNow,
                Tags = metadata.Tags,
                Author = "Mostafa Samir Said",
                LikesCount = 0,
                CommentsCount = 0,
                StarsCount = 0,
                ForksCount = 0
            };

            return Ok(dto);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = $"Failed to import from URL: {ex.Message}" });
        }
    }

    private string DetectPlatformType(string url)
    {
        if (url.Contains("linkedin.com")) return "LinkedIn";
        if (url.Contains("github.com")) return "GitHub";
        if (url.Contains("dev.to")) return "Dev.to";
        if (url.Contains("twitter.com") || url.Contains("x.com")) return "Twitter";
        if (url.Contains("medium.com")) return "Medium";
        if (url.Contains("pinterest.com")) return "Pinterest";
        if (url.Contains("stackoverflow.com")) return "StackOverflow";
        return "Other";
    }

    private PostMetadata ExtractMetadata(string html, string platform)
    {
        var metadata = new PostMetadata();

        // Extract Open Graph tags
        metadata.Title = ExtractMetaTag(html, "og:title") ?? ExtractMetaTag(html, "twitter:title") ?? ExtractTitleTag(html);
        metadata.Description = ExtractMetaTag(html, "og:description") ?? ExtractMetaTag(html, "twitter:description") ?? ExtractMetaTag(html, "description");
        metadata.ImageUrl = ExtractMetaTag(html, "og:image") ?? ExtractMetaTag(html, "twitter:image");
        
        // For StackOverflow, try to extract the question body as content
        if (platform == "StackOverflow")
        {
            var questionBody = ExtractStackOverflowQuestion(html);
            metadata.Content = questionBody ?? metadata.Description;
            
            // Extract tags from StackOverflow
            var tags = ExtractStackOverflowTags(html);
            if (!string.IsNullOrEmpty(tags))
            {
                metadata.Tags = tags;
            }
        }
        else
        {
            metadata.Content = metadata.Description;
        }

        // Try to extract published date
        var dateStr = ExtractMetaTag(html, "article:published_time") ?? ExtractMetaTag(html, "og:updated_time");
        if (!string.IsNullOrEmpty(dateStr) && DateTime.TryParse(dateStr, out var date))
        {
            metadata.PublishedDate = date;
        }

        // Extract keywords as tags if not already set
        if (string.IsNullOrEmpty(metadata.Tags))
        {
            var keywords = ExtractMetaTag(html, "keywords");
            if (!string.IsNullOrEmpty(keywords))
            {
                metadata.Tags = keywords;
            }
        }

        return metadata;
    }

    private string? ExtractStackOverflowQuestion(string html)
    {
        // Try to extract the question body from StackOverflow
        var pattern = @"<div class=""s-prose js-post-body""[^>]*>(.*?)</div>";
        var match = System.Text.RegularExpressions.Regex.Match(html, pattern, System.Text.RegularExpressions.RegexOptions.IgnoreCase | System.Text.RegularExpressions.RegexOptions.Singleline);
        
        if (match.Success)
        {
            var content = match.Groups[1].Value;
            // Remove HTML tags for a cleaner text
            content = System.Text.RegularExpressions.Regex.Replace(content, "<.*?>", " ");
            content = System.Net.WebUtility.HtmlDecode(content);
            content = System.Text.RegularExpressions.Regex.Replace(content, @"\s+", " ").Trim();
            
            // Limit to first 500 characters for summary
            if (content.Length > 500)
            {
                content = content.Substring(0, 500) + "...";
            }
            
            return content;
        }
        
        return null;
    }

    private string? ExtractStackOverflowTags(string html)
    {
        // Extract tags from StackOverflow
        var pattern = @"<a[^>]*class=""[^""]*post-tag[^""]*""[^>]*>([^<]+)</a>";
        var matches = System.Text.RegularExpressions.Regex.Matches(html, pattern, System.Text.RegularExpressions.RegexOptions.IgnoreCase);
        
        if (matches.Count > 0)
        {
            var tags = new List<string>();
            foreach (System.Text.RegularExpressions.Match match in matches)
            {
                tags.Add(match.Groups[1].Value.Trim());
            }
            return string.Join(", ", tags);
        }
        
        return null;
    }

    private string? ExtractMetaTag(string html, string property)
    {
        // Try property attribute (Open Graph)
        var propertyPattern = $@"<meta\s+property=[""']{property}[""']\s+content=[""']([^""']+)[""']";
        var match = System.Text.RegularExpressions.Regex.Match(html, propertyPattern, System.Text.RegularExpressions.RegexOptions.IgnoreCase);
        if (match.Success) return System.Net.WebUtility.HtmlDecode(match.Groups[1].Value);

        // Try name attribute (standard meta tags)
        var namePattern = $@"<meta\s+name=[""']{property}[""']\s+content=[""']([^""']+)[""']";
        match = System.Text.RegularExpressions.Regex.Match(html, namePattern, System.Text.RegularExpressions.RegexOptions.IgnoreCase);
        if (match.Success) return System.Net.WebUtility.HtmlDecode(match.Groups[1].Value);

        // Try reversed order
        var reversedPattern = $@"<meta\s+content=[""']([^""']+)[""']\s+property=[""']{property}[""']";
        match = System.Text.RegularExpressions.Regex.Match(html, reversedPattern, System.Text.RegularExpressions.RegexOptions.IgnoreCase);
        if (match.Success) return System.Net.WebUtility.HtmlDecode(match.Groups[1].Value);

        return null;
    }

    private string? ExtractTitleTag(string html)
    {
        var pattern = @"<title>([^<]+)</title>";
        var match = System.Text.RegularExpressions.Regex.Match(html, pattern, System.Text.RegularExpressions.RegexOptions.IgnoreCase);
        return match.Success ? System.Net.WebUtility.HtmlDecode(match.Groups[1].Value) : null;
    }
}

public class ImportUrlRequest
{
    public string Url { get; set; } = string.Empty;
}

public class PostMetadata
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Content { get; set; }
    public string? ImageUrl { get; set; }
    public DateTime? PublishedDate { get; set; }
    public string? Tags { get; set; }
}
