using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.API.Application.Features.Experiences.DTOs;
using Portfolio.API.Application.Features.Experiences.Services;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExperiencesController : ControllerBase
{
    private readonly IExperienceService _experienceService;

    /// <summary>
    /// Initializes a new ExperiencesController that uses the provided experience service for handling experience operations.
    /// </summary>
    /// <param name="experienceService">Service that provides CRUD operations and DTO handling for experiences.</param>
    public ExperiencesController(IExperienceService experienceService)
    {
        _experienceService = experienceService;
    }

    /// <summary>
    /// Retrieves all experience DTOs.
    /// </summary>
    /// <returns>An ActionResult containing a collection of ExperienceDto; on success contains HTTP 200 OK with the list of experiences.</returns>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ExperienceDto>>> GetExperiences()
    {
        var experiences = await _experienceService.GetExperiencesAsync();
        return Ok(experiences);
    }

    /// <summary>
    /// Retrieves a single experience by its identifier.
    /// </summary>
    /// <param name="id">The identifier of the experience to retrieve.</param>
    /// <returns>The requested <see cref="ExperienceDto"/> if found; a NotFound result otherwise.</returns>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ExperienceDto>> GetExperienceById(Guid id)
    {
        var experience = await _experienceService.GetExperienceByIdAsync(id);
        if (experience == null) return NotFound();
        return Ok(experience);
    }

    /// <summary>
    /// Creates a new experience resource from the provided DTO and returns the created resource.
    /// </summary>
    /// <param name="dto">The experience data to create.</param>
    /// <returns>The created ExperienceDto and a 201 Created response with a Location header for the new resource.</returns>
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ExperienceDto>> CreateExperience(ExperienceDto dto)
    {
        var result = await _experienceService.CreateExperienceAsync(dto);
        return CreatedAtAction(nameof(GetExperienceById), new { id = result.Id }, result);
    }

    /// <summary>
    /// Updates the experience identified by the given id with values from the provided DTO.
    /// </summary>
    /// <param name="id">The unique identifier of the experience to update.</param>
    /// <param name="dto">An ExperienceDto containing the updated values for the experience.</param>
    /// <returns>The updated ExperienceDto if the update succeeds.</returns>
    [Authorize]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateExperience(Guid id, ExperienceDto dto)
    {
        var result = await _experienceService.UpdateExperienceAsync(id, dto);
        return Ok(result);
    }

    /// <summary>
    /// Deletes the experience with the specified identifier.
    /// </summary>
    /// <param name="id">The GUID of the experience to delete.</param>
    /// <returns>`NoContent` (204) if the experience was deleted; `NotFound` (404) if no experience exists with the specified id.</returns>
    [Authorize]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteExperience(Guid id)
    {
        var deleted = await _experienceService.DeleteExperienceAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }
}
