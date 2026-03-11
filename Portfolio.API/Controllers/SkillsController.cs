using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.API.Application.Features.Skills.DTOs;
using Portfolio.API.Application.Features.Skills.Services;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SkillsController : ControllerBase
{
    private readonly ISkillService _skillService;

    /// <summary>
    /// Initializes a new instance of the <see cref="SkillsController"/> class with the specified skill service.
    /// </summary>
    /// <param name="skillService">Service that provides operations for managing skill data.</param>
    public SkillsController(ISkillService skillService)
    {
        _skillService = skillService;
    }

    /// <summary>
    /// Retrieves all skill records.
    /// </summary>
    /// <returns>An ActionResult containing the collection of SkillDto objects.</returns>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SkillDto>>> GetSkills()
    {
        var skills = await _skillService.GetSkillsAsync();
        return Ok(skills);
    }

    /// <summary>
    /// Retrieves a skill by its GUID identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the skill to retrieve.</param>
    /// <returns>The requested <see cref="SkillDto"/> with a 200 OK response if found; a 404 NotFound response if no skill exists with the given identifier.</returns>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<SkillDto>> GetSkillById(Guid id)
    {
        var skill = await _skillService.GetSkillByIdAsync(id);
        if (skill == null) return NotFound();
        return Ok(skill);
    }

    /// <summary>
    /// Creates a new skill resource.
    /// </summary>
    /// <param name="dto">The skill data to create.</param>
    /// <returns>The created SkillDto including its assigned Id.</returns>
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<SkillDto>> CreateSkill(SkillDto dto)
    {
        var result = await _skillService.CreateSkillAsync(dto);
        return CreatedAtAction(nameof(GetSkillById), new { id = result.Id }, result);
    }

    /// <summary>
    /// Updates the skill identified by the specified id using the provided SkillDto.
    /// </summary>
    /// <param name="id">The unique identifier of the skill to update.</param>
    /// <param name="dto">The new values for the skill.</param>
    /// <returns>An OK response containing the updated SkillDto.</returns>
    [Authorize]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateSkill(Guid id, SkillDto dto)
    {
        var result = await _skillService.UpdateSkillAsync(id, dto);
        return Ok(result);
    }

    /// <summary>
    /// Deletes the skill with the specified identifier.
    /// </summary>
    /// <param name="id">The GUID of the skill to delete.</param>
    /// <returns>204 No Content if the skill was deleted, 404 Not Found if no skill with the specified id exists.</returns>
    [Authorize]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteSkill(Guid id)
    {
        var deleted = await _skillService.DeleteSkillAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }
}
