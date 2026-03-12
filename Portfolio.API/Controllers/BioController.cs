using Microsoft.AspNetCore.Mvc;
using Portfolio.API.Application.Features.Bio.DTOs;
using Portfolio.API.Application.Features.Bio.Services;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BioController : ControllerBase
{
    private readonly IBioService _bioService;

    /// <summary>
    /// Initializes a new instance of <see cref="BioController"/> with the provided bio service.
    /// </summary>
    /// <param name="bioService">Service used to retrieve and update bio information.</param>
    public BioController(IBioService bioService)
    {
        _bioService = bioService;
    }

    /// <summary>
    /// Updates an existing bio entry identified by the given id.
    /// </summary>
    /// <param name="id">The identifier of the bio to update.</param>
    /// <param name="dto">A BioDto containing the updated bio data.</param>
    /// <returns>The update operation result wrapped in an HTTP 200 (OK) response.</returns>
    [Microsoft.AspNetCore.Authorization.Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBio(Guid id, BioDto dto)
    {
        var result = await _bioService.UpdateBioAsync(id, dto);
        return Ok(result);
    }

    /// <summary>
    /// Retrieves the current bio information for the site.
    /// </summary>
    /// <returns>The retrieved BioDto, or null if no bio exists.</returns>
    [HttpGet]
    public async Task<ActionResult<BioDto?>> GetBio()
    {
        var bio = await _bioService.GetBioAsync();
        return Ok(bio);
    }
}
