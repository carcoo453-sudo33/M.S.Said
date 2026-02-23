using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.API.Entities;
using Portfolio.API.Repositories;
using Portfolio.API.DTOs;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public ProjectsController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
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
            .Include(p => p.Metrics)
            .Include(p => p.Comments)
            .FirstOrDefaultAsync(p => p.Slug == slug);
            
        if (project == null) return NotFound();
        return MapToDto(project);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ProjectDto>> CreateProject(ProjectDto dto)
    {
        var entry = new ProjectEntry
        {
            Id = dto.Id != Guid.Empty ? dto.Id : Guid.NewGuid(),
            Title = dto.Title,
            Description = dto.Description,
            Summary = dto.Summary,
            ImageUrl = dto.ImageUrl,
            DemoUrl = dto.ProjectUrl,
            RepoUrl = dto.GitHubUrl,
            Category = dto.Category,
            TechStack = dto.Technologies,
            Tags = dto.Tags,
            Niche = dto.Niche,
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
            entry.KeyFeatures = dto.KeyFeatures.Select(f => new ProjectKeyFeature { Icon = f.Icon, Title = f.Title, Description = f.Description }).ToList();
            
        // ... other sub-collections can be added similarly

        await _unitOfWork.Repository<ProjectEntry>().AddAsync(entry);
        await _unitOfWork.CompleteAsync();
        return CreatedAtAction(nameof(GetProjects), new { id = entry.Id }, MapToDto(entry));
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProject(Guid id, ProjectDto dto)
    {
        var repository = _unitOfWork.Repository<ProjectEntry>();
        var project = await repository.Query()
            .Include(p => p.KeyFeatures)
            .Include(p => p.Changelog)
            .Include(p => p.Metrics)
            .Include(p => p.Comments)
            .FirstOrDefaultAsync(p => p.Id == id);
        
        if (project == null) return NotFound();

        project.Title = dto.Title;
        project.Description = dto.Description;
        project.Summary = dto.Summary;
        project.ImageUrl = dto.ImageUrl;
        project.DemoUrl = dto.ProjectUrl;
        project.RepoUrl = dto.GitHubUrl;
        project.Category = dto.Category;
        project.TechStack = dto.Technologies;
        project.Tags = dto.Tags;
        project.Niche = dto.Niche;
        project.Duration = dto.Duration;
        project.Language = dto.Language;
        project.Architecture = dto.Architecture;
        project.Status = dto.Status;
        project.Order = dto.Order;
        project.IsFeatured = dto.IsFeatured;
        project.Views = dto.Views;
        project.ReactionsCount = dto.ReactionsCount;
        project.UpdatedAt = DateTime.UtcNow;
        
        project.GalleryJson = JsonSerializer.Serialize(dto.Gallery);
        project.ResponsibilitiesJson = JsonSerializer.Serialize(dto.Responsibilities);

        // Update sub-collections (simplified: clear and re-add for this demo/scale)
        // In a real production app, you might want to track changes more granularly
        project.KeyFeatures.Clear();
        foreach (var f in dto.KeyFeatures) 
            project.KeyFeatures.Add(new ProjectKeyFeature { Icon = f.Icon, Title = f.Title, Description = f.Description });

        await _unitOfWork.CompleteAsync();
        return Ok(MapToDto(project));
    }

    private ProjectDto MapToDto(ProjectEntry p)
    {
        return new ProjectDto
        {
            Id = p.Id,
            Title = p.Title,
            Slug = p.Slug,
            Description = p.Description,
            Summary = p.Summary,
            ImageUrl = p.ImageUrl,
            ProjectUrl = p.DemoUrl,
            GitHubUrl = p.RepoUrl,
            Category = p.Category ?? "",
            Technologies = p.TechStack ?? "",
            Tags = p.Tags,
            Niche = p.Niche,
            Duration = p.Duration,
            Language = p.Language,
            Architecture = p.Architecture,
            Status = p.Status,
            Order = p.Order,
            IsFeatured = p.IsFeatured,
            Views = p.Views,
            ReactionsCount = p.ReactionsCount,
            CreatedAt = p.CreatedAt,
            Gallery = !string.IsNullOrEmpty(p.GalleryJson) ? JsonSerializer.Deserialize<List<string>>(p.GalleryJson) ?? new() : new(),
            Responsibilities = !string.IsNullOrEmpty(p.ResponsibilitiesJson) ? JsonSerializer.Deserialize<List<string>>(p.ResponsibilitiesJson) ?? new() : new(),
            KeyFeatures = p.KeyFeatures?.Select(f => new KeyFeatureDto { Icon = f.Icon, Title = f.Title, Description = f.Description }).ToList() ?? new(),
            Changelog = p.Changelog?.Select(c => new ChangelogItemDto { Date = c.Date, Version = c.Version, Title = c.Title, Description = c.Description }).ToList() ?? new(),
            Metrics = p.Metrics?.Select(m => new MetricDto { Label = m.Label, Value = m.Value, Trend = m.Trend }).ToList() ?? new(),
            Comments = p.Comments?.Select(c => new CommentDto { Id = c.Id.ToString(), Author = c.Author, AvatarUrl = c.AvatarUrl, Date = c.Date, Content = c.Content, Likes = c.Likes }).ToList() ?? new(),
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
                Technologies = p.TechStack,
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
        var trending = projects.OrderByDescending(p => p.Views).First();

        // 2. Latest: Most recent (excluding trending)
        var latest = projects.Where(p => p.Id != trending.Id).FirstOrDefault();

        var featured = new List<ProjectEntry> { trending };
        if (latest != null) featured.Add(latest);

        return Ok(featured.Select(MapToDto));
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProject(Guid id)
    {
        var entry = await _unitOfWork.Repository<ProjectEntry>().GetByIdAsync(id);
        if (entry == null) return NotFound();
        _unitOfWork.Repository<ProjectEntry>().Delete(entry);
        await _unitOfWork.CompleteAsync();
        return NoContent();
    }
}
