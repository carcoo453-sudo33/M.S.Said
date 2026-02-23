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
            ProjectUrl = dto.ProjectUrl,
            GitHubUrl = dto.GitHubUrl,
            Category = dto.Category,
            Technologies = dto.Technologies,
            Order = dto.Order,
            IsFeatured = dto.IsFeatured
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
        project.ProjectUrl = dto.ProjectUrl;
        project.GitHubUrl = dto.GitHubUrl;
        project.Category = dto.Category;
        project.Technologies = dto.Technologies;
        project.Order = dto.Order;
        project.IsFeatured = dto.IsFeatured;
        project.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.CompleteAsync();
        return Ok(project);
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
