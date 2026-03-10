using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.API.Data;
using Portfolio.API.DTOs;
using Portfolio.API.Entities;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NichesController : ControllerBase
{
    private readonly PortfolioDbContext _context;

    public NichesController(PortfolioDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<NicheDto>>> GetAll()
    {
        var niches = await _context.Niches
            .OrderBy(n => n.Name)
            .Select(n => new NicheDto
            {
                Id = n.Id,
                Name = n.Name,
                Name_Ar = n.Name_Ar
            })
            .ToListAsync();

        return Ok(niches);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<NicheDto>> GetById(Guid id)
    {
        var niche = await _context.Niches.FindAsync(id);

        if (niche == null)
            return NotFound();

        return Ok(new NicheDto
        {
            Id = niche.Id,
            Name = niche.Name,
            Name_Ar = niche.Name_Ar
        });
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<NicheDto>> Create(NicheDto dto)
    {
        // Check if niche with same name already exists
        var exists = await _context.Niches
            .AnyAsync(n => n.Name.ToLower() == dto.Name.ToLower());

        if (exists)
            return BadRequest("Niche with this name already exists");

        var niche = new Niche
        {
            Name = dto.Name,
            Name_Ar = dto.Name_Ar
        };

        _context.Niches.Add(niche);
        await _context.SaveChangesAsync();

        dto.Id = niche.Id;
        return CreatedAtAction(nameof(GetById), new { id = niche.Id }, dto);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, NicheDto dto)
    {
        var niche = await _context.Niches.FindAsync(id);

        if (niche == null)
            return NotFound();

        // Check if another niche with same name exists
        var exists = await _context.Niches
            .AnyAsync(n => n.Name.ToLower() == dto.Name.ToLower() && n.Id != id);

        if (exists)
            return BadRequest("Another niche with this name already exists");

        niche.Name = dto.Name;
        niche.Name_Ar = dto.Name_Ar;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var niche = await _context.Niches.FindAsync(id);

        if (niche == null)
            return NotFound();

        _context.Niches.Remove(niche);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
