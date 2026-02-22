using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.API.Data;
using Portfolio.API.Entities;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly PortfolioDbContext _context;

    public ProjectsController(PortfolioDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProjectEntry>>> GetProjects()
    {
        return await _context.Projects.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProjectEntry>> GetProject(Guid id)
    {
        var project = await _context.Projects.FindAsync(id);
        if (project == null) return NotFound();
        return project;
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ProjectEntry>> CreateProject(ProjectEntry entry)
    {
        _context.Projects.Add(entry);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetProjects), new { id = entry.Id }, entry);
    }
}
