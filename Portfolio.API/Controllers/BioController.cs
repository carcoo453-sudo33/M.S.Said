using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.API.Data;
using Portfolio.API.Entities;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BioController : ControllerBase
{
    private readonly PortfolioDbContext _context;

    public BioController(PortfolioDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<BioEntry>> GetBio()
    {
        var bio = await _context.BioEntries.FirstOrDefaultAsync();
        if (bio == null) return NotFound();
        return bio;
    }
}
