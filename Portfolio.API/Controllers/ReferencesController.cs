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

    /// <summary>
    /// Initializes a new instance of <see cref="ReferencesController"/> with the specified reference service.
    /// </summary>
    /// <param name="referenceService">Service that provides reference retrieval, creation, update, and deletion operations.</param>
    public ReferencesController(IReferenceService referenceService)
    {
        _referenceService = referenceService;
    }

    /// <summary>
    /// Retrieves all reference records.
    /// </summary>
    /// <returns>An ActionResult containing a sequence of ReferenceDto objects; returns 200 OK with the list.</returns>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ReferenceDto>>> GetReferences()
    {
        var references = await _referenceService.GetReferencesAsync();
        return Ok(references);
    }

    /// <summary>
    /// Retrieves a single reference identified by the provided GUID.
    /// </summary>
    /// <param name="id">The unique identifier of the reference to retrieve.</param>
    /// <returns>
    /// An ActionResult containing the requested ReferenceDto if found; a 404 NotFound result otherwise.
    /// </returns>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ReferenceDto>> GetReferenceById(Guid id)
    {
        var reference = await _referenceService.GetReferenceByIdAsync(id);
        if (reference == null) return NotFound();
        return Ok(reference);
    }

    /// <summary>
    /// Create a new reference from the provided DTO and return its representation with a Location header pointing to the created resource.
    /// </summary>
    /// <param name="dto">The reference data to create.</param>
    /// <returns>The created <see cref="ReferenceDto"/> including its assigned Id; the response is a 201 Created with a Location header for the new resource.</returns>
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ReferenceDto>> CreateReference(ReferenceDto dto)
    {
        var result = await _referenceService.CreateReferenceAsync(dto);
        return CreatedAtAction(nameof(GetReferenceById), new { id = result.Id }, result);
    }

    /// <summary>
    /// Updates an existing reference identified by the provided GUID using the supplied DTO.
    /// </summary>
    /// <param name="id">The GUID of the reference to update.</param>
    /// <param name="dto">The updated reference data.</param>
    /// <returns>`200 OK` with the updated ReferenceDto when the update succeeds; `404 NotFound` if no reference exists with the specified id.</returns>
    [Authorize]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateReference(Guid id, ReferenceDto dto)
    {
        var result = await _referenceService.UpdateReferenceAsync(id, dto);
        if (result == null) return NotFound();
        return Ok(result);
    }
    /// <summary>
    /// Deletes the reference identified by the provided GUID.
    /// </summary>
    /// <param name="id">The GUID of the reference to delete.</param>
    /// <returns>HTTP 204 No Content if the reference was deleted, HTTP 404 Not Found if no reference exists with the specified id.</returns>
    [Authorize]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteReference(Guid id)
    {
        var deleted = await _referenceService.DeleteReferenceAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }
}
