using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.API.Entities;
using Portfolio.API.Repositories;

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

    [HttpGet("{id}")]
    public async Task<ActionResult<ProjectEntry>> GetProject(Guid id)
    {
        var project = await _unitOfWork.Repository<ProjectEntry>().GetByIdAsync(id);
        if (project == null) return NotFound();
        return project;
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ProjectEntry>> CreateProject(ProjectEntry entry)
    {
        await _unitOfWork.Repository<ProjectEntry>().AddAsync(entry);
        await _unitOfWork.CompleteAsync();
        return CreatedAtAction(nameof(GetProjects), new { id = entry.Id }, entry);
    }
}
