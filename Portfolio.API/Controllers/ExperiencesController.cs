using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.API.Data;
using Portfolio.API.Entities;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExperiencesController : ControllerBase
{
    private readonly PortfolioDbContext _context;

    public ExperiencesController(PortfolioDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ExperienceEntry>>> GetExperiences()
    {
        return await _context.Experiences.OrderByDescending(e => e.Duration).ToListAsync();
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ExperienceEntry>> CreateExperience(ExperienceEntry entry)
    {
        _context.Experiences.Add(entry);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetExperiences), new { id = entry.Id }, entry);
    }
}
