using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.API.Application.Features.Niches.DTOs;
using Portfolio.API.Application.Features.Niches.Services;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NichesController : ControllerBase
{
    private readonly INicheService _nicheService;

    public NichesController(INicheService nicheService)
    {
        _nicheService = nicheService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<NicheDto>>> GetAll()
    {
        var niches = await _nicheService.GetNichesAsync();
        return Ok(niches);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<NicheDto>> GetById(Guid id)
    {
        var niche = await _nicheService.GetNicheByIdAsync(id);
        if (niche == null) return NotFound();
        return Ok(niche);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<NicheDto>> Create(NicheDto dto)
    {
        var result = await _nicheService.CreateNicheAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [Authorize]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, NicheDto dto)
    {
        var result = await _nicheService.UpdateNicheAsync(id, dto);
        return Ok(result);
    }

    [Authorize]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            await _nicheService.DeleteNicheAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }
}
