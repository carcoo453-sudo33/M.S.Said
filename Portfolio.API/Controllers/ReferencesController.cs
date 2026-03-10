using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.API.Application.Features.References.DTOs;
using Portfolio.API.Application.Features.References.Services;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReferencesController : ControllerBase
{
    private readonly IReferenceService _referenceService;

    public ReferencesController(IReferenceService referenceService)
    {
        _referenceService = referenceService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ReferenceDto>>> GetReferences()
    {
        var references = await _referenceService.GetReferencesAsync();
        return Ok(references);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ReferenceDto>> GetReferenceById(Guid id)
    {
        var reference = await _referenceService.GetReferenceByIdAsync(id);
        if (reference == null) return NotFound();
        return Ok(reference);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ReferenceDto>> CreateReference(ReferenceDto dto)
    {
        var result = await _referenceService.CreateReferenceAsync(dto);
        return CreatedAtAction(nameof(GetReferenceById), new { id = result.Id }, result);
    }

    [Authorize]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateReference(Guid id, ReferenceDto dto)
    {
        var result = await _referenceService.UpdateReferenceAsync(id, dto);
        return Ok(result);
    }

    [Authorize]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteReference(Guid id)
    {
        await _referenceService.DeleteReferenceAsync(id);
        return NoContent();
    }
}
