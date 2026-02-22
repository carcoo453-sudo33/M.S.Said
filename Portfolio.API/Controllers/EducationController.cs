using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.API.Data;
using Portfolio.API.Entities;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EducationController : ControllerBase
{
    private readonly PortfolioDbContext _context;

    public EducationController(PortfolioDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<EducationEntry>>> GetEducation()
    {
        return await _context.EducationEntries
            .OrderByDescending(e => e.Duration)
            .ToListAsync();
    }
}
