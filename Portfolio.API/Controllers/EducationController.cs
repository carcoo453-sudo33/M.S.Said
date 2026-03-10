using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.API.Application.Features.Education.DTOs;
using Portfolio.API.Application.Features.Education.Services;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EducationController : ControllerBase
{
    private readonly IEducationService _educationService;

    public EducationController(IEducationService educationService)
    {
        _educationService = educationService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<EducationDto>>> GetEducation()
    {
        var education = await _educationService.GetEducationAsync();
        return Ok(education);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<EducationDto>> GetEducationById(Guid id)
    {
        var education = await _educationService.GetEducationByIdAsync(id);
        if (education == null) return NotFound();
        return Ok(education);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<EducationDto>> CreateEducation(EducationDto dto)
    {
        var result = await _educationService.CreateEducationAsync(dto);
        return CreatedAtAction(nameof(GetEducationById), new { id = result.Id }, result);
    }

    [Authorize]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateEducation(Guid id, EducationDto dto)
    {
        var result = await _educationService.UpdateEducationAsync(id, dto);
        if (result == null) return NotFound();
        return Ok(result);
    }
    [Authorize]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteEducation(Guid id)
    {
        var deleted = await _educationService.DeleteEducationAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }
}
