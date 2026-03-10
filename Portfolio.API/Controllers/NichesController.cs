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

    /// <summary>
    /// Initializes a new instance of NichesController with the specified niche service.
    /// </summary>
    /// <param name="nicheService">Service that provides CRUD operations for niches.</param>
    public NichesController(INicheService nicheService)
    {
        _nicheService = nicheService;
    }

    /// <summary>
    /// Retrieves all niches available in the system.
    /// </summary>
    /// <returns>A collection of all niches as NicheDto objects.</returns>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<NicheDto>>> GetAll()
    {
        var niches = await _nicheService.GetNichesAsync();
        return Ok(niches);
    }

    /// <summary>
    /// Retrieves the niche with the specified identifier.
    /// </summary>
    /// <param name="id">The GUID of the niche to retrieve.</param>
    /// <returns>An ActionResult containing the niche DTO when found; a NotFound result if no niche exists with the given id.</returns>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<NicheDto>> GetById(Guid id)
    {
        var niche = await _nicheService.GetNicheByIdAsync(id);
        if (niche == null) return NotFound();
        return Ok(niche);
    }

    /// <summary>
    /// Creates a new niche resource and returns its representation with a Location header.
    /// </summary>
    /// <param name="dto">The data transfer object containing the niche properties to create.</param>
    /// <returns>The created <see cref="NicheDto"/> including its assigned Id; the response is 201 Created with a Location header referencing the new resource.</returns>
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<NicheDto>> Create(NicheDto dto)
    {
        var result = await _nicheService.CreateNicheAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    /// <summary>
    /// Updates the niche with the specified id using values from the provided DTO.
    /// </summary>
    /// <param name="id">Identifier of the niche to update.</param>
    /// <param name="dto">Data transfer object containing updated niche properties.</param>
    /// <returns>The updated <see cref="NicheDto"/>.</returns>
    [Authorize]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, NicheDto dto)
    {
        var result = await _nicheService.UpdateNicheAsync(id, dto);
        return Ok(result);
    }

    /// <summary>
    /// Deletes the niche identified by the specified id.
    /// </summary>
    /// <param name="id">The GUID of the niche to delete.</param>
    /// <returns>HTTP 204 No Content when deletion succeeds; HTTP 404 Not Found if the niche does not exist.</returns>
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
