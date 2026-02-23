using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.API.Entities;
using Portfolio.API.Repositories;
using Portfolio.API.DTOs;

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
    public async Task<ActionResult<IEnumerable<ProjectEntry>>> GetProjects()
    {
        var projects = await _unitOfWork.Repository<ProjectEntry>().GetAllAsync();
        return Ok(projects);
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<ProjectEntry>> GetProject(string slug)
    {
        var project = (await _unitOfWork.Repository<ProjectEntry>().FindAsync(p => p.Slug == slug)).FirstOrDefault();
        if (project == null) return NotFound();
        return project;
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ProjectEntry>> CreateProject(ProjectDto dto)
    {
        var entry = new ProjectEntry
        {
            Id = dto.Id != Guid.Empty ? dto.Id : Guid.NewGuid(),
            Title = dto.Title,
            Description = dto.Description,
            ImageUrl = dto.ImageUrl,
            DemoUrl = dto.ProjectUrl,
            RepoUrl = dto.GitHubUrl,
            Category = dto.Category,
            TechStack = dto.Technologies,
            Order = dto.Order,
            IsFeatured = dto.IsFeatured,
            Slug = dto.Title.ToLower().Replace(" ", "-") // Basic slug generation
        };
        await _unitOfWork.Repository<ProjectEntry>().AddAsync(entry);
        await _unitOfWork.CompleteAsync();
        return CreatedAtAction(nameof(GetProjects), new { id = entry.Id }, entry);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProject(Guid id, ProjectDto dto)
    {
        var repository = _unitOfWork.Repository<ProjectEntry>();
        var project = await repository.GetByIdAsync(id);
        
        if (project == null) return NotFound();

        project.Title = dto.Title;
        project.Description = dto.Description;
        project.ImageUrl = dto.ImageUrl;
        project.DemoUrl = dto.ProjectUrl;
        project.RepoUrl = dto.GitHubUrl;
        project.Category = dto.Category;
        project.TechStack = dto.Technologies;
        project.Order = dto.Order;
        project.IsFeatured = dto.IsFeatured;
        project.Views = dto.Views;
        project.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.CompleteAsync();
        return Ok(project);
    }

    [HttpGet("featured")]
    public async Task<ActionResult<IEnumerable<ProjectEntry>>> GetFeaturedProjects()
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

        return Ok(featured);
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
