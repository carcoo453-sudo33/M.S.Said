using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.API.Entities;
using Portfolio.API.Repositories;
using Portfolio.API.DTOs;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Portfolio.API.Services;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly INotificationService _notificationService;

    public ProjectsController(IUnitOfWork unitOfWork, INotificationService notificationService)
    {
        _unitOfWork = unitOfWork;
        _notificationService = notificationService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProjectDto>>> GetProjects()
    {
        var projects = await _unitOfWork.Repository<ProjectEntry>()
            .Query()
            .OrderBy(p => p.Order)
            .ToListAsync();
            
        return Ok(projects.Select(MapToDto));
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<ProjectDto>> GetProject(string slug)
    {
        var project = await _unitOfWork.Repository<ProjectEntry>()
            .Query()
            .Include(p => p.KeyFeatures)
            .Include(p => p.Changelog)
            .Include(p => p.Comments)
            .FirstOrDefaultAsync(p => p.Slug == slug);
            
        if (project == null) return NotFound();
        
        // Increment view count
        project.Views++;
        project.UpdatedAt = DateTime.UtcNow;
        await _unitOfWork.CompleteAsync();
        
        return MapToDto(project);
    }

    // [Authorize] // Temporarily disabled for development
    [HttpPost]
    public async Task<ActionResult<ProjectDto>> CreateProject(ProjectDto dto)
    {
        var entry = new ProjectEntry
        {
            Id = dto.Id != Guid.Empty ? dto.Id : Guid.NewGuid(),
            Title = dto.Title,
            Title_Ar = dto.Title_Ar,
            Description = dto.Description,
            Description_Ar = dto.Description_Ar,
            Summary = dto.Summary,
            Summary_Ar = dto.Summary_Ar,
            ImageUrl = dto.ImageUrl,
            DemoUrl = dto.ProjectUrl,
            RepoUrl = dto.GitHubUrl,
            Category = dto.Category,
            Category_Ar = dto.Category_Ar,
            TechStack = dto.Tags,
            Tags = dto.Tags,
            Tags_Ar = dto.Tags_Ar,
            Niche = dto.Niche,
            Niche_Ar = dto.Niche_Ar,
            Company = dto.Company,
            Company_Ar = dto.Company_Ar,
            Duration = dto.Duration,
            Language = dto.Language,
            Architecture = dto.Architecture,
            Status = dto.Status,
            Order = dto.Order,
            IsFeatured = dto.IsFeatured,
            Views = dto.Views,
            ReactionsCount = dto.ReactionsCount,
            Slug = dto.Title.ToLower().Replace(" ", "-"),
            GalleryJson = JsonSerializer.Serialize(dto.Gallery),
            ResponsibilitiesJson = JsonSerializer.Serialize(dto.Responsibilities)
        };

        // Map sub-collections if provided
        if (dto.KeyFeatures != null)
            entry.KeyFeatures = dto.KeyFeatures.Select(f => new Entities.ProjectKeyFeature { Icon = f.Icon, Title = f.Title, Title_Ar = f.Title_Ar, Description = f.Description, Description_Ar = f.Description_Ar }).ToList();
            
        // ... other sub-collections can be added similarly

        await _unitOfWork.Repository<ProjectEntry>().AddAsync(entry);
        await _unitOfWork.CompleteAsync();
        return CreatedAtAction(nameof(GetProjects), new { id = entry.Id }, MapToDto(entry));
    }

    // [Authorize] // Temporarily disabled for development
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProject(Guid id, ProjectDto dto)
    {
        var repository = _unitOfWork.Repository<ProjectEntry>();
        var project = await repository.Query()
            .Include(p => p.KeyFeatures)
            .Include(p => p.Changelog)
            .Include(p => p.Comments)
            .FirstOrDefaultAsync(p => p.Id == id);
        
        if (project == null) return NotFound();

        project.Title = dto.Title;
        project.Title_Ar = dto.Title_Ar;
        project.Description = dto.Description;
        project.Description_Ar = dto.Description_Ar;
        project.Summary = dto.Summary;
        project.Summary_Ar = dto.Summary_Ar;
        project.ImageUrl = dto.ImageUrl;
        project.DemoUrl = dto.ProjectUrl;
        project.RepoUrl = dto.GitHubUrl;
        project.Category = dto.Category;
        project.Category_Ar = dto.Category_Ar;
        project.TechStack = dto.Tags;
        project.Tags = dto.Tags;
        project.Tags_Ar = dto.Tags_Ar;
        project.Niche = dto.Niche;
        project.Niche_Ar = dto.Niche_Ar;
        project.Company = dto.Company;
        project.Company_Ar = dto.Company_Ar;
        project.Duration = dto.Duration;
        project.Duration_Ar = dto.Duration_Ar;
        project.Language = dto.Language;
        project.Language_Ar = dto.Language_Ar;
        project.Architecture = dto.Architecture;
        project.Architecture_Ar = dto.Architecture_Ar;
        project.Status = dto.Status;
        project.Status_Ar = dto.Status_Ar;
        project.Order = dto.Order;
        project.IsFeatured = dto.IsFeatured;
        project.Views = dto.Views;
        project.ReactionsCount = dto.ReactionsCount;
        project.UpdatedAt = DateTime.UtcNow;
        
        project.GalleryJson = JsonSerializer.Serialize(dto.Gallery);
        project.ResponsibilitiesJson = JsonSerializer.Serialize(dto.Responsibilities);

        // Update KeyFeatures - Remove existing and add new
        var featureRepo = _unitOfWork.Repository<Entities.ProjectKeyFeature>();
        var existingFeatures = await featureRepo.Query()
            .Where(f => f.ProjectEntryId == id)
            .ToListAsync();
        foreach (var feature in existingFeatures)
        {
            featureRepo.Delete(feature);
        }
        
        foreach (var f in dto.KeyFeatures)
        {
            await featureRepo.AddAsync(new Entities.ProjectKeyFeature 
            { 
                Icon = f.Icon, 
                Title = f.Title,
                Title_Ar = f.Title_Ar,
                Description = f.Description,
                Description_Ar = f.Description_Ar,
                ProjectEntryId = project.Id,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });
        }

        // Update Changelog - Remove existing and add new
        var changelogRepo = _unitOfWork.Repository<Entities.ProjectChangelogItem>();
        var existingChangelog = await changelogRepo.Query()
            .Where(c => c.ProjectEntryId == id)
            .ToListAsync();
        foreach (var item in existingChangelog)
        {
            changelogRepo.Delete(item);
        }
        
        foreach (var c in dto.Changelog)
        {
            await changelogRepo.AddAsync(new Entities.ProjectChangelogItem
            {
                Date = c.Date,
                Version = c.Version,
                Title = c.Title,
                Title_Ar = c.Title_Ar,
                Description = c.Description,
                Description_Ar = c.Description_Ar,
                ProjectEntryId = project.Id,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });
        }

        await _unitOfWork.CompleteAsync();
        return Ok(MapToDto(project));
    }

    private ProjectDto MapToDto(ProjectEntry p)
    {
        return new ProjectDto
        {
            Id = p.Id,
            Title = p.Title,
            Title_Ar = p.Title_Ar,
            Slug = p.Slug,
            Description = p.Description,
            Description_Ar = p.Description_Ar,
            Summary = p.Summary,
            Summary_Ar = p.Summary_Ar,
            ImageUrl = p.ImageUrl,
            ProjectUrl = p.DemoUrl,
            GitHubUrl = p.RepoUrl,
            Category = p.Category ?? "",
            Category_Ar = p.Category_Ar,
            Tags = p.Tags,
            Tags_Ar = p.Tags_Ar,
            Niche = p.Niche,
            Niche_Ar = p.Niche_Ar,
            Company = p.Company,
            Company_Ar = p.Company_Ar,
            Duration = p.Duration,
            Duration_Ar = p.Duration_Ar,
            Language = p.Language,
            Language_Ar = p.Language_Ar,
            Architecture = p.Architecture,
            Architecture_Ar = p.Architecture_Ar,
            Status = p.Status,
            Status_Ar = p.Status_Ar,
            Order = p.Order,
            IsFeatured = p.IsFeatured,
            Views = p.Views,
            ReactionsCount = p.ReactionsCount,
            CreatedAt = p.CreatedAt,
            Gallery = !string.IsNullOrEmpty(p.GalleryJson) ? JsonSerializer.Deserialize<List<string>>(p.GalleryJson) ?? new() : new(),
            Responsibilities = !string.IsNullOrEmpty(p.ResponsibilitiesJson) ? JsonSerializer.Deserialize<List<string>>(p.ResponsibilitiesJson) ?? new() : new(),
            KeyFeatures = p.KeyFeatures?.Select(f => new KeyFeatureDto { Icon = f.Icon, Title = f.Title, Title_Ar = f.Title_Ar, Description = f.Description, Description_Ar = f.Description_Ar }).ToList() ?? new(),
            Changelog = p.Changelog?.Select(c => new ChangelogItemDto { Date = c.Date, Version = c.Version, Title = c.Title, Title_Ar = c.Title_Ar, Description = c.Description, Description_Ar = c.Description_Ar }).ToList() ?? new(),
            Comments = p.Comments?.Select(c => new CommentDto 
            { 
                Id = c.Id.ToString(), 
                Author = c.Author, 
                AvatarUrl = c.AvatarUrl, 
                Date = c.Date, 
                Content = c.Content, 
                Likes = c.Likes,
                Replies = !string.IsNullOrEmpty(c.RepliesJson) ? JsonSerializer.Deserialize<List<CommentReplyDto>>(c.RepliesJson) ?? new() : new()
            }).ToList() ?? new(),
            RelatedProjects = GetRelatedProjects(p.Id, p.Category).Result
        };
    }

    private async Task<List<ProjectSummaryDto>> GetRelatedProjects(Guid currentId, string? category)
    {
        var all = await _unitOfWork.Repository<ProjectEntry>().GetAllAsync();
        return all
            .Where(p => p.Id != currentId)
            .OrderByDescending(p => p.Category == category && !string.IsNullOrEmpty(category))
            .ThenByDescending(p => p.CreatedAt)
            .Take(3)
            .Select(p => new ProjectSummaryDto
            {
                Id = p.Id,
                Title = p.Title,
                Slug = p.Slug,
                ImageUrl = p.ImageUrl,
                Tags = p.Tags,
                Category = p.Category
            })
            .ToList();
    }

    [HttpGet("featured")]
    public async Task<ActionResult<IEnumerable<ProjectDto>>> GetFeaturedProjects()
    {
        var projects = (await _unitOfWork.Repository<ProjectEntry>().GetAllAsync())
            .OrderByDescending(p => p.CreatedAt)
            .ToList();

        if (!projects.Any()) return Ok(new List<ProjectEntry>());

        // 1. Trending: Highest Views
        var trending = projects.OrderByDescending(p => p.Views).FirstOrDefault();

        // 2. Latest: Most recent (excluding trending)
        var latest = trending != null ? projects.Where(p => p.Id != trending.Id).FirstOrDefault() : null;

        var featured = new List<ProjectEntry>();
        if (trending != null) featured.Add(trending);
        if (latest != null) featured.Add(latest);

        return Ok(featured.Select(MapToDto));
    }

    // [Authorize] // Temporarily disabled for development
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProject(Guid id)
    {
        var entry = await _unitOfWork.Repository<ProjectEntry>().GetByIdAsync(id);
        if (entry == null) return NotFound();
        _unitOfWork.Repository<ProjectEntry>().Delete(entry);
        await _unitOfWork.CompleteAsync();
        return NoContent();
    }

    [HttpPost("{projectId}/comments")]
    public async Task<ActionResult<CommentDto>> AddComment(Guid projectId, [FromBody] CreateCommentDto commentDto)
    {
        try
        {
            Console.WriteLine($"[AddComment] ===== ENDPOINT HIT =====");
            Console.WriteLine($"[AddComment] Received request for projectId: {projectId}");
            Console.WriteLine($"[AddComment] CommentDto is null: {commentDto == null}");
            Console.WriteLine($"[AddComment] CommentDto - Author: {commentDto?.Author}, Content: {commentDto?.Content}, AvatarUrl: {commentDto?.AvatarUrl}");
            
            if (commentDto == null)
            {
                Console.WriteLine("[AddComment] ERROR: commentDto is null");
                return BadRequest(new { message = "Comment data is required" });
            }

            if (string.IsNullOrWhiteSpace(commentDto.Content))
            {
                Console.WriteLine("[AddComment] ERROR: Content is empty");
                return BadRequest(new { message = "Comment content is required" });
            }

            // Verify project exists
            var projectRepository = _unitOfWork.Repository<ProjectEntry>();
            var projectExists = await projectRepository.Query()
                .AnyAsync(p => p.Id == projectId);

            if (!projectExists)
            {
                Console.WriteLine($"[AddComment] ERROR: Project not found with ID: {projectId}");
                return NotFound(new { message = "Project not found" });
            }

            Console.WriteLine($"[AddComment] Project exists, creating comment...");

            // Create comment directly using comment repository
            var comment = new ProjectComment
            {
                Id = Guid.NewGuid(),
                ProjectEntryId = projectId,
                Author = commentDto.Author ?? "Anonymous",
                AvatarUrl = commentDto.AvatarUrl,
                Date = DateTime.UtcNow.ToString("MMM dd, yyyy"),
                Content = commentDto.Content,
                Likes = 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var commentRepository = _unitOfWork.Repository<ProjectComment>();
            await commentRepository.AddAsync(comment);
            
            Console.WriteLine($"[AddComment] Comment added to repository, saving...");
            await _unitOfWork.CompleteAsync();
            
            Console.WriteLine($"[AddComment] Comment saved successfully with ID: {comment.Id}");

            // Create notification for new comment
            await _notificationService.CreateNotificationAsync(
                type: "Comment",
                title: "New Project Comment",
                message: $"{comment.Author} commented on a project: \"{comment.Content.Substring(0, Math.Min(50, comment.Content.Length))}...\"",
                link: $"/projects/{projectId}",
                relatedEntityId: comment.Id.ToString(),
                relatedEntityType: "ProjectComment",
                senderName: comment.Author
            );

            return Ok(new CommentDto
            {
                Id = comment.Id.ToString(),
                Author = comment.Author,
                AvatarUrl = comment.AvatarUrl,
                Date = comment.Date,
                Content = comment.Content,
                Likes = comment.Likes
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[AddComment] EXCEPTION: {ex.Message}");
            Console.WriteLine($"[AddComment] Stack trace: {ex.StackTrace}");
            return BadRequest(new { message = "Failed to add comment", error = ex.Message });
        }
    }

    [HttpPost("{projectId}/comments/{commentId}/like")]
    public async Task<ActionResult<CommentDto>> LikeComment(Guid projectId, Guid commentId)
    {
        try
        {
            var project = await _unitOfWork.Repository<ProjectEntry>()
                .Query()
                .Include(p => p.Comments)
                .FirstOrDefaultAsync(p => p.Id == projectId);

            if (project == null) return NotFound(new { message = "Project not found" });

            var comment = project.Comments?.FirstOrDefault(c => c.Id == commentId);
            if (comment == null) return NotFound(new { message = "Comment not found" });

            comment.Likes++;
            comment.UpdatedAt = DateTime.UtcNow;
            await _unitOfWork.CompleteAsync();

            return Ok(new CommentDto
            {
                Id = comment.Id.ToString(),
                Author = comment.Author,
                AvatarUrl = comment.AvatarUrl,
                Date = comment.Date,
                Content = comment.Content,
                Likes = comment.Likes,
                Replies = !string.IsNullOrEmpty(comment.RepliesJson) ? JsonSerializer.Deserialize<List<CommentReplyDto>>(comment.RepliesJson) ?? new() : new()
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Failed to like comment", error = ex.Message });
        }
    }

    [HttpPost("{projectId}/comments/{commentId}/reply")]
    public async Task<ActionResult<CommentDto>> AddReply(Guid projectId, Guid commentId, [FromBody] CreateReplyDto replyDto)
    {
        try
        {
            Console.WriteLine($"[AddReply] Adding reply to comment {commentId} in project {projectId}");
            
            if (replyDto == null || string.IsNullOrWhiteSpace(replyDto.Content))
            {
                return BadRequest(new { message = "Reply content is required" });
            }

            var project = await _unitOfWork.Repository<ProjectEntry>()
                .Query()
                .Include(p => p.Comments)
                .FirstOrDefaultAsync(p => p.Id == projectId);

            if (project == null) return NotFound(new { message = "Project not found" });

            var comment = project.Comments?.FirstOrDefault(c => c.Id == commentId);
            if (comment == null) return NotFound(new { message = "Comment not found" });

            // Deserialize existing replies or create new list
            var replies = !string.IsNullOrEmpty(comment.RepliesJson) 
                ? JsonSerializer.Deserialize<List<CommentReplyDto>>(comment.RepliesJson) ?? new() 
                : new List<CommentReplyDto>();

            // Add new reply
            var newReply = new CommentReplyDto
            {
                Id = Guid.NewGuid().ToString(),
                Author = replyDto.Author ?? "Anonymous",
                AvatarUrl = replyDto.AvatarUrl,
                Date = DateTime.UtcNow.ToString("MMM dd, yyyy"),
                Content = replyDto.Content
            };

            replies.Add(newReply);

            // Serialize back to JSON
            comment.RepliesJson = JsonSerializer.Serialize(replies);
            comment.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.CompleteAsync();

            Console.WriteLine($"[AddReply] Reply added successfully");

            // Create notification for new reply
            await _notificationService.CreateNotificationAsync(
                type: "Reply",
                title: "New Comment Reply",
                message: $"{newReply.Author} replied to a comment: \"{newReply.Content.Substring(0, Math.Min(50, newReply.Content.Length))}...\"",
                link: $"/projects/{projectId}",
                relatedEntityId: newReply.Id,
                relatedEntityType: "CommentReply",
                senderName: newReply.Author
            );

            return Ok(new CommentDto
            {
                Id = comment.Id.ToString(),
                Author = comment.Author,
                AvatarUrl = comment.AvatarUrl,
                Date = comment.Date,
                Content = comment.Content,
                Likes = comment.Likes,
                Replies = replies
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[AddReply] ERROR: {ex.Message}");
            return BadRequest(new { message = "Failed to add reply", error = ex.Message });
        }
    }

    [HttpPost("{projectId}/import-from-github")]
    public async Task<ActionResult<ProjectDto>> ImportFromGitHub(Guid projectId, [FromBody] GitHubImportRequest request)
    {
        try
        {
            Console.WriteLine($"[ImportFromGitHub] ===== ENDPOINT HIT =====");
            Console.WriteLine($"[ImportFromGitHub] Starting import for project {projectId}");
            Console.WriteLine($"[ImportFromGitHub] Request object is null: {request == null}");
            Console.WriteLine($"[ImportFromGitHub] GitHub URL: {request?.GitHubUrl ?? "NULL"}");

            if (request == null || string.IsNullOrEmpty(request.GitHubUrl))
            {
                Console.WriteLine($"[ImportFromGitHub] Request or GitHub URL is null/empty");
                return BadRequest(new { message = "GitHub URL is required" });
            }

            // Parse GitHub URL to extract owner and repo
            var (owner, repo) = ParseGitHubUrl(request.GitHubUrl);
            Console.WriteLine($"[ImportFromGitHub] Parsed - Owner: {owner}, Repo: {repo}");
            
            if (string.IsNullOrEmpty(owner) || string.IsNullOrEmpty(repo))
            {
                Console.WriteLine($"[ImportFromGitHub] Invalid GitHub URL format");
                return BadRequest(new { message = "Invalid GitHub URL format. Use: https://github.com/owner/repo" });
            }

            using var httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Add("User-Agent", "Portfolio-App");
            if (!string.IsNullOrEmpty(request.GitHubToken))
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {request.GitHubToken}");
            }

            // Fetch data from GitHub
            var features = new List<(string icon, string title, string description)>();
            var responsibilities = new List<string>();
            var releases = new List<GitHubRelease>();
            GitHubRepository? repoData = null;

            Console.WriteLine($"[ImportFromGitHub] Fetching README...");
            var readmeUrl = $"https://api.github.com/repos/{owner}/{repo}/readme";
            var readmeResponse = await httpClient.GetAsync(readmeUrl);
            Console.WriteLine($"[ImportFromGitHub] README response: {readmeResponse.StatusCode}");
            
            if (readmeResponse.IsSuccessStatusCode)
            {
                var readmeDataResponse = await readmeResponse.Content.ReadFromJsonAsync<GitHubReadmeResponse>();
                if (readmeDataResponse?.Content != null)
                {
                    var readmeContent = System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(readmeDataResponse.Content));
                    Console.WriteLine($"[ImportFromGitHub] README content length: {readmeContent.Length}");
                    ExtractFeaturesAndResponsibilitiesFromReadme(readmeContent, out features, out responsibilities);
                    
                    // If no features found, try to extract from description
                    if (!features.Any() && repoData?.Description != null)
                    {
                        Console.WriteLine($"[ImportFromGitHub] No features in README, using repo description");
                        features.Add(("Layers", "Project Overview", repoData.Description));
                    }
                }
            }

            Console.WriteLine($"[ImportFromGitHub] Fetching releases...");
            var releasesUrl = $"https://api.github.com/repos/{owner}/{repo}/releases";
            var releasesResponse = await httpClient.GetAsync(releasesUrl);
            Console.WriteLine($"[ImportFromGitHub] Releases response: {releasesResponse.StatusCode}");
            
            if (releasesResponse.IsSuccessStatusCode)
            {
                var releasesData = await releasesResponse.Content.ReadFromJsonAsync<List<GitHubRelease>>();
                if (releasesData != null)
                {
                    releases = releasesData;
                    Console.WriteLine($"[ImportFromGitHub] Found {releases.Count} releases");
                }
            }

            Console.WriteLine($"[ImportFromGitHub] Fetching repository stats...");
            var repoUrl = $"https://api.github.com/repos/{owner}/{repo}";
            var repoResponse = await httpClient.GetAsync(repoUrl);
            Console.WriteLine($"[ImportFromGitHub] Repo response: {repoResponse.StatusCode}");
            
            if (repoResponse.IsSuccessStatusCode)
            {
                repoData = await repoResponse.Content.ReadFromJsonAsync<GitHubRepository>();
                if (repoData != null)
                {
                    Console.WriteLine($"[ImportFromGitHub] Stars: {repoData.StargazersCount}, Forks: {repoData.ForksCount}");
                }
            }

            // Fetch images from screenshots folder
            Console.WriteLine($"[ImportFromGitHub] Fetching screenshots folder...");
            var screenshotsUrl = $"https://api.github.com/repos/{owner}/{repo}/contents/screenshots";
            var screenshotsResponse = await httpClient.GetAsync(screenshotsUrl);
            Console.WriteLine($"[ImportFromGitHub] Screenshots response: {screenshotsResponse.StatusCode}");
            
            string? mainImageUrl = null;
            var galleryImageUrls = new List<string>();
            
            if (screenshotsResponse.IsSuccessStatusCode)
            {
                var screenshotsData = await screenshotsResponse.Content.ReadFromJsonAsync<List<GitHubContentItem>>();
                if (screenshotsData != null && screenshotsData.Any())
                {
                    Console.WriteLine($"[ImportFromGitHub] Found {screenshotsData.Count} items in screenshots folder");
                    
                    // Filter only image files
                    var imageFiles = screenshotsData
                        .Where(f => f.Type == "file" && 
                               (f.Name.EndsWith(".png", StringComparison.OrdinalIgnoreCase) ||
                                f.Name.EndsWith(".jpg", StringComparison.OrdinalIgnoreCase) ||
                                f.Name.EndsWith(".jpeg", StringComparison.OrdinalIgnoreCase) ||
                                f.Name.EndsWith(".gif", StringComparison.OrdinalIgnoreCase) ||
                                f.Name.EndsWith(".webp", StringComparison.OrdinalIgnoreCase)))
                        .ToList();
                    
                    Console.WriteLine($"[ImportFromGitHub] Found {imageFiles.Count} image files");
                    
                    // Find main.png for main image
                    var mainImage = imageFiles.FirstOrDefault(f => 
                        f.Name.Equals("main.png", StringComparison.OrdinalIgnoreCase) ||
                        f.Name.Equals("main.jpg", StringComparison.OrdinalIgnoreCase) ||
                        f.Name.Equals("main.jpeg", StringComparison.OrdinalIgnoreCase));
                    
                    if (mainImage != null)
                    {
                        mainImageUrl = mainImage.DownloadUrl;
                        Console.WriteLine($"[ImportFromGitHub] Found main image: {mainImage.Name}");
                    }
                    else if (imageFiles.Any())
                    {
                        // Use first image as main if no main.png found
                        mainImageUrl = imageFiles.First().DownloadUrl;
                        Console.WriteLine($"[ImportFromGitHub] Using first image as main: {imageFiles.First().Name}");
                    }
                    
                    // Add other images to gallery (excluding the main image)
                    galleryImageUrls = imageFiles
                        .Where(f => f.DownloadUrl != mainImageUrl && !string.IsNullOrEmpty(f.DownloadUrl))
                        .Take(10) // Limit to 10 gallery images
                        .Select(f => f.DownloadUrl!)
                        .ToList();
                    
                    Console.WriteLine($"[ImportFromGitHub] Gallery images count: {galleryImageUrls.Count}");
                }
            }
            else
            {
                Console.WriteLine($"[ImportFromGitHub] Screenshots folder not found or inaccessible");
            }

            // Now update the database with fetched data
            var repository = _unitOfWork.Repository<ProjectEntry>();
            var project = await repository.GetByIdAsync(projectId);
            
            if (project == null)
            {
                Console.WriteLine($"[ImportFromGitHub] Project not found: {projectId}");
                return NotFound(new { message = "Project not found" });
            }

            // Update language if available
            if (repoData != null && !string.IsNullOrEmpty(repoData.Language))
            {
                project.Language = repoData.Language;
            }

            // Update main image if found
            if (!string.IsNullOrEmpty(mainImageUrl))
            {
                project.ImageUrl = mainImageUrl;
                Console.WriteLine($"[ImportFromGitHub] Set main image URL");
            }

            // Update gallery images if found
            if (galleryImageUrls.Any())
            {
                project.GalleryJson = JsonSerializer.Serialize(galleryImageUrls);
                Console.WriteLine($"[ImportFromGitHub] Set gallery with {galleryImageUrls.Count} images");
            }

            // Update responsibilities JSON
            if (responsibilities.Any())
            {
                project.ResponsibilitiesJson = JsonSerializer.Serialize(responsibilities.Take(10).ToList());
            }

            project.UpdatedAt = DateTime.UtcNow;
            
            // Save project changes first
            await _unitOfWork.CompleteAsync();
            Console.WriteLine($"[ImportFromGitHub] Project updated");

            // Add features if any
            if (features.Any())
            {
                var featureRepo = _unitOfWork.Repository<Entities.ProjectKeyFeature>();
                foreach (var (icon, title, description) in features.Take(8))
                {
                    await featureRepo.AddAsync(new Entities.ProjectKeyFeature
                    {
                        Icon = icon,
                        Title = title,
                        Description = description,
                        ProjectEntryId = projectId,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    });
                }
                await _unitOfWork.CompleteAsync();
                Console.WriteLine($"[ImportFromGitHub] Added {features.Count} features");
            }

            // Add changelog if any and project doesn't have changelog
            var changelogRepo = _unitOfWork.Repository<Entities.ProjectChangelogItem>();
            var existingChangelog = await changelogRepo.Query()
                .Where(c => c.ProjectEntryId == projectId && !c.IsDeleted)
                .CountAsync();
                
            if (releases.Any() && existingChangelog == 0)
            {
                foreach (var release in releases.Take(10))
                {
                    await changelogRepo.AddAsync(new Entities.ProjectChangelogItem
                    {
                        Date = release.PublishedAt?.ToString("MMM dd, yyyy") ?? DateTime.UtcNow.ToString("MMM dd, yyyy"),
                        Version = release.TagName ?? "v1.0.0",
                        Title = release.Name ?? release.TagName ?? "Release",
                        Description = release.Body?.Length > 200 ? release.Body.Substring(0, 200) + "..." : release.Body ?? "",
                        ProjectEntryId = projectId,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    });
                }
                await _unitOfWork.CompleteAsync();
                Console.WriteLine($"[ImportFromGitHub] Added {releases.Count} changelog items");
            }

            // Fetch the updated project with all includes
            var updatedProject = await repository.Query()
                .Include(p => p.KeyFeatures)
                .Include(p => p.Changelog)
                .Include(p => p.Comments)
                .FirstOrDefaultAsync(p => p.Id == projectId);

            Console.WriteLine($"[ImportFromGitHub] Import completed successfully");
            return Ok(MapToDto(updatedProject!));
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[ImportFromGitHub] ERROR: {ex.Message}");
            Console.WriteLine($"[ImportFromGitHub] Stack trace: {ex.StackTrace}");
            return BadRequest(new { message = "Failed to import from GitHub", error = ex.Message, details = ex.ToString() });
        }
    }

    private void ExtractFeaturesAndResponsibilitiesFromReadme(string readme, 
        out List<(string icon, string title, string description)> features, 
        out List<string> responsibilities)
    {
        features = new List<(string, string, string)>();
        responsibilities = new List<string>();
        
        Console.WriteLine($"[ExtractFeatures] README length: {readme.Length}");
        
        var lines = readme.Split('\n');
        var inFeaturesSection = false;
        var inResponsibilitiesSection = false;
        var featuresList = new List<string>();
        var respList = new List<string>();

        foreach (var line in lines)
        {
            var trimmed = line.Trim();

            // Detect Features section
            if (trimmed.Contains("## Features", StringComparison.OrdinalIgnoreCase) ||
                trimmed.Contains("## Key Features", StringComparison.OrdinalIgnoreCase) ||
                trimmed.Contains("## ✨ Features", StringComparison.OrdinalIgnoreCase) ||
                trimmed.Contains("### Features", StringComparison.OrdinalIgnoreCase))
            {
                Console.WriteLine($"[ExtractFeatures] Found Features section: {trimmed}");
                inFeaturesSection = true;
                inResponsibilitiesSection = false;
                continue;
            }

            // Detect Responsibilities/Tasks section
            if (trimmed.Contains("## Responsibilities", StringComparison.OrdinalIgnoreCase) ||
                trimmed.Contains("## Tasks", StringComparison.OrdinalIgnoreCase) ||
                trimmed.Contains("## What I Did", StringComparison.OrdinalIgnoreCase) ||
                trimmed.Contains("### Responsibilities", StringComparison.OrdinalIgnoreCase))
            {
                Console.WriteLine($"[ExtractFeatures] Found Responsibilities section: {trimmed}");
                inResponsibilitiesSection = true;
                inFeaturesSection = false;
                continue;
            }

            // Stop at next major section (but not subsections)
            if (trimmed.StartsWith("## ") && 
                !trimmed.Contains("Feature", StringComparison.OrdinalIgnoreCase) &&
                !trimmed.Contains("Responsibilit", StringComparison.OrdinalIgnoreCase) &&
                !trimmed.Contains("Task", StringComparison.OrdinalIgnoreCase))
            {
                if (inFeaturesSection || inResponsibilitiesSection)
                {
                    Console.WriteLine($"[ExtractFeatures] Stopping at section: {trimmed}");
                    inFeaturesSection = false;
                    inResponsibilitiesSection = false;
                }
            }

            // Extract bullet points (support -, *, +, and numbered lists)
            if (inFeaturesSection || inResponsibilitiesSection)
            {
                var isBullet = trimmed.StartsWith("- ") || trimmed.StartsWith("* ") || trimmed.StartsWith("+ ");
                var isNumbered = System.Text.RegularExpressions.Regex.IsMatch(trimmed, @"^\d+\.\s");
                
                if (isBullet || isNumbered)
                {
                    var text = isBullet ? trimmed.Substring(2).Trim() : 
                               System.Text.RegularExpressions.Regex.Replace(trimmed, @"^\d+\.\s", "").Trim();
                    
                    // Remove markdown formatting
                    text = System.Text.RegularExpressions.Regex.Replace(text, @"\*\*(.*?)\*\*", "$1"); // Bold
                    text = System.Text.RegularExpressions.Regex.Replace(text, @"\*(.*?)\*", "$1"); // Italic
                    text = System.Text.RegularExpressions.Regex.Replace(text, @"`(.*?)`", "$1"); // Code
                    text = System.Text.RegularExpressions.Regex.Replace(text, @"\[(.*?)\]\(.*?\)", "$1"); // Links
                    
                    if (inFeaturesSection)
                    {
                        featuresList.Add(text);
                        Console.WriteLine($"[ExtractFeatures] Added feature: {text.Substring(0, Math.Min(50, text.Length))}...");
                    }
                    else if (inResponsibilitiesSection)
                    {
                        respList.Add(text);
                        Console.WriteLine($"[ExtractFeatures] Added responsibility: {text.Substring(0, Math.Min(50, text.Length))}...");
                    }
                }
            }
        }

        Console.WriteLine($"[ExtractFeatures] Total features found: {featuresList.Count}");
        Console.WriteLine($"[ExtractFeatures] Total responsibilities found: {respList.Count}");

        // Convert features to structured format
        var icons = new[] { "Layers", "Rocket", "Monitor", "Code", "Zap", "Shield", "Database", "Globe" };
        for (int i = 0; i < Math.Min(featuresList.Count, 8); i++)
        {
            var feature = featuresList[i];
            var parts = feature.Split(new[] { ':', '-', '–' }, 2, StringSplitOptions.RemoveEmptyEntries);
            var title = parts.Length > 1 ? parts[0].Trim() : (feature.Length > 50 ? feature.Substring(0, 50) : feature);
            var description = parts.Length > 1 ? parts[1].Trim() : feature;
            description = description.Length > 200 ? description.Substring(0, 200) + "..." : description;
            
            features.Add((icons[i % icons.Length], title, description));
        }

        // Convert responsibilities
        responsibilities = respList.Take(10)
            .Select(r => r.Length > 150 ? r.Substring(0, 150) + "..." : r)
            .ToList();
            
        Console.WriteLine($"[ExtractFeatures] Final features count: {features.Count}");
        Console.WriteLine($"[ExtractFeatures] Final responsibilities count: {responsibilities.Count}");
    }

    private (string owner, string repo) ParseGitHubUrl(string url)
    {
        try
        {
            // Handle formats: https://github.com/owner/repo or github.com/owner/repo
            var uri = new Uri(url.StartsWith("http") ? url : $"https://{url}");
            var segments = uri.AbsolutePath.Trim('/').Split('/');
            if (segments.Length >= 2)
            {
                return (segments[0], segments[1].Replace(".git", ""));
            }
        }
        catch { }
        return (string.Empty, string.Empty);
    }

    [HttpPost("{projectId}/react")]
    public async Task<ActionResult<int>> ReactToProject(Guid projectId)
    {
        try
        {
            var project = await _unitOfWork.Repository<ProjectEntry>().GetByIdAsync(projectId);
            if (project == null) return NotFound(new { message = "Project not found" });

            project.ReactionsCount++;
            project.UpdatedAt = DateTime.UtcNow;
            await _unitOfWork.CompleteAsync();

            return Ok(project.ReactionsCount);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Failed to react to project", error = ex.Message });
        }
    }

    [HttpGet("test-cors")]
    public IActionResult TestCors()
    {
        return Ok(new { message = "CORS is working!", timestamp = DateTime.UtcNow });
    }

    [HttpGet("health")]
    public IActionResult Health()
    {
        return Ok(new { status = "healthy", timestamp = DateTime.UtcNow, version = "1.0" });
    }

    [Authorize]
    [HttpPost("import-from-url")]
    public async Task<ActionResult<ProjectDto>> ImportFromUrl([FromBody] GitHubImportRequest request)
    {
        try
        {
            if (request == null || string.IsNullOrEmpty(request.GitHubUrl))
            {
                return BadRequest(new { message = "GitHub URL is required" });
            }

            // Parse GitHub URL to extract owner and repo
            var (owner, repo) = ParseGitHubUrl(request.GitHubUrl);
            
            if (string.IsNullOrEmpty(owner) || string.IsNullOrEmpty(repo))
            {
                return BadRequest(new { message = "Invalid GitHub URL format. Use: https://github.com/owner/repo" });
            }

            using var httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Add("User-Agent", "Portfolio-App");
            if (!string.IsNullOrEmpty(request.GitHubToken))
            {
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {request.GitHubToken}");
            }

            // Fetch data from GitHub
            var features = new List<(string icon, string title, string description)>();
            var responsibilities = new List<string>();
            var releases = new List<GitHubRelease>();
            GitHubRepository? repoData = null;

            // Fetch README
            var readmeUrl = $"https://api.github.com/repos/{owner}/{repo}/readme";
            var readmeResponse = await httpClient.GetAsync(readmeUrl);
            
            if (readmeResponse.IsSuccessStatusCode)
            {
                var readmeDataResponse = await readmeResponse.Content.ReadFromJsonAsync<GitHubReadmeResponse>();
                if (readmeDataResponse?.Content != null)
                {
                    var readmeContent = System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(readmeDataResponse.Content));
                    ExtractFeaturesAndResponsibilitiesFromReadme(readmeContent, out features, out responsibilities);
                }
            }

            // Fetch releases
            var releasesUrl = $"https://api.github.com/repos/{owner}/{repo}/releases";
            var releasesResponse = await httpClient.GetAsync(releasesUrl);
            
            if (releasesResponse.IsSuccessStatusCode)
            {
                var releasesData = await releasesResponse.Content.ReadFromJsonAsync<List<GitHubRelease>>();
                if (releasesData != null)
                {
                    releases = releasesData;
                }
            }

            // Fetch repository stats
            var repoUrl = $"https://api.github.com/repos/{owner}/{repo}";
            var repoResponse = await httpClient.GetAsync(repoUrl);
            
            if (repoResponse.IsSuccessStatusCode)
            {
                repoData = await repoResponse.Content.ReadFromJsonAsync<GitHubRepository>();
            }

            // Build DTO with imported data
            var dto = new ProjectDto
            {
                Id = Guid.Empty,
                Title = repoData?.Name?.Replace("-", " ").Replace("_", " ") ?? repo.Replace("-", " ").Replace("_", " "),
                Description = repoData?.Description ?? "",
                Summary = repoData?.Description ?? "",
                GitHubUrl = request.GitHubUrl,
                ProjectUrl = repoData?.Homepage ?? "",
                Language = repoData?.Language ?? "Multiple Languages",
                Duration = DateTime.UtcNow.Year.ToString(),
                Architecture = "Scalable Architecture",
                Status = "Active",
                Category = repoData?.Language ?? "Web Development",
                Tags = repoData?.Topics != null && repoData.Topics.Any() ? string.Join(", ", repoData.Topics) : "",
                Responsibilities = responsibilities.Take(10).ToList(),
                KeyFeatures = features.Take(8).Select(f => new KeyFeatureDto
                {
                    Icon = f.icon,
                    Title = f.title,
                    Description = f.description
                }).ToList(),
                Changelog = releases.Take(10).Select(r => new ChangelogItemDto
                {
                    Date = r.PublishedAt?.ToString("MMM dd, yyyy") ?? DateTime.UtcNow.ToString("MMM dd, yyyy"),
                    Version = r.TagName ?? "v1.0.0",
                    Title = r.Name ?? r.TagName ?? "Release",
                    Description = r.Body?.Length > 200 ? r.Body.Substring(0, 200) + "..." : r.Body ?? ""
                }).ToList()
            };

            return Ok(dto);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = $"Failed to import from GitHub: {ex.Message}" });
        }
    }

    [HttpGet("suggestions/tags")]
    public async Task<ActionResult<List<string>>> GetTagSuggestions()
    {
        var projects = await _unitOfWork.Repository<ProjectEntry>().GetAllAsync();
        var tags = projects
            .Where(p => !string.IsNullOrEmpty(p.Tags))
            .SelectMany(p => p.Tags!.Split(',', StringSplitOptions.RemoveEmptyEntries))
            .Select(t => t.Trim())
            .Where(t => !string.IsNullOrEmpty(t))
            .Distinct()
            .OrderBy(t => t)
            .ToList();
        
        return Ok(tags);
    }

    [HttpGet("suggestions/categories")]
    public async Task<ActionResult<List<string>>> GetCategorySuggestions()
    {
        var projects = await _unitOfWork.Repository<ProjectEntry>().GetAllAsync();
        var categories = projects
            .Where(p => !string.IsNullOrEmpty(p.Category))
            .Select(p => p.Category!)
            .Distinct()
            .OrderBy(c => c)
            .ToList();
        
        return Ok(categories);
    }

    [HttpGet("suggestions/niches")]
    public async Task<ActionResult<List<string>>> GetNicheSuggestions()
    {
        var projects = await _unitOfWork.Repository<ProjectEntry>().GetAllAsync();
        var niches = projects
            .Where(p => !string.IsNullOrEmpty(p.Niche))
            .Select(p => p.Niche!)
            .Distinct()
            .OrderBy(n => n)
            .ToList();
        
        return Ok(niches);
    }

}