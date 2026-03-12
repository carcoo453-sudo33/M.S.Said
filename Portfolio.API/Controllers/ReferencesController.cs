using Microsoft.AspNetCore.Mvc;
using Portfolio.API.Application.Features.References.DTOs;
using Portfolio.API.Application.Features.References.Services;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReferencesController : ControllerBase
{
    private readonly IReferenceService _referenceService;

    /// <summary>
    /// Initializes a new instance of <see cref="ReferencesController"/> with the provided reference service.
    /// </summary>
    /// <param name="referenceService">Service used to manage references.</param>
    public ReferencesController(IReferenceService referenceService)
    {
        _referenceService = referenceService;
    }

    /// <summary>
    /// Retrieves all references.
    /// </summary>
    /// <returns>A list of all references.</returns>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ReferenceDto>>> GetReferences()
    {
        var references = await _referenceService.GetReferencesAsync();
        return Ok(references);
    }

    /// <summary>
    /// Retrieves a specific reference by its identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the reference.</param>
    /// <returns>The reference if found, otherwise not found.</returns>
    [HttpGet("{id}")]
    public async Task<ActionResult<ReferenceDto>> GetReferenceById(Guid id)
    {
        var reference = await _referenceService.GetReferenceByIdAsync(id);
        if (reference == null)
            return NotFound();
        return Ok(reference);
    }

    /// <summary>
    /// Creates a new reference.
    /// </summary>
    /// <param name="dto">The reference data to create.</param>
    /// <returns>The created reference.</returns>
    [Microsoft.AspNetCore.Authorization.Authorize]
    [HttpPost]
    public async Task<ActionResult<ReferenceDto>> CreateReference(ReferenceDto dto)
    {
        var reference = await _referenceService.CreateReferenceAsync(dto);
        return CreatedAtAction(nameof(GetReferenceById), new { id = reference.Id }, reference);
    }

    /// <summary>
    /// Updates an existing reference.
    /// </summary>
    /// <param name="id">The unique identifier of the reference to update.</param>
    /// <param name="dto">The updated reference data.</param>
    /// <returns>The updated reference.</returns>
    [Microsoft.AspNetCore.Authorization.Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult<ReferenceDto>> UpdateReference(Guid id, ReferenceDto dto)
    {
        var reference = await _referenceService.UpdateReferenceAsync(id, dto);
        if (reference == null)
            return NotFound();
        return Ok(reference);
    }

    /// <summary>
    /// Deletes a reference.
    /// </summary>
    /// <param name="id">The unique identifier of the reference to delete.</param>
    /// <returns>No content if successful.</returns>
    [Microsoft.AspNetCore.Authorization.Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteReference(Guid id)
    {
        var success = await _referenceService.DeleteReferenceAsync(id);
        if (!success)
            return NotFound();
        return NoContent();
    }
}
