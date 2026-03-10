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

    public ExperiencesController(IExperienceService experienceService)
    {
        _experienceService = experienceService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ExperienceDto>>> GetExperiences()
    {
        var experiences = await _experienceService.GetExperiencesAsync();
        return Ok(experiences);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ExperienceDto>> GetExperienceById(Guid id)
    {
        var experience = await _experienceService.GetExperienceByIdAsync(id);
        if (experience == null) return NotFound();
        return Ok(experience);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ExperienceDto>> CreateExperience(ExperienceDto dto)
    {
        var result = await _experienceService.CreateExperienceAsync(dto);
        return CreatedAtAction(nameof(GetExperienceById), new { id = result.Id }, result);
    }

    [Authorize]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateExperience(Guid id, ExperienceDto dto)
    {
        var result = await _experienceService.UpdateExperienceAsync(id, dto);
        return Ok(result);
    }

    [Authorize]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteExperience(Guid id)
    {
        await _experienceService.DeleteExperienceAsync(id);
        return NoContent();
    }
}
