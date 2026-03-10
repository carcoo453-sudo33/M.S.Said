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

    public SkillsController(ISkillService skillService)
    {
        _skillService = skillService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SkillDto>>> GetSkills()
    {
        var skills = await _skillService.GetSkillsAsync();
        return Ok(skills);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<SkillDto>> GetSkillById(Guid id)
    {
        var skill = await _skillService.GetSkillByIdAsync(id);
        if (skill == null) return NotFound();
        return Ok(skill);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<SkillDto>> CreateSkill(SkillDto dto)
    {
        var result = await _skillService.CreateSkillAsync(dto);
        return CreatedAtAction(nameof(GetSkillById), new { id = result.Id }, result);
    }

    [Authorize]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateSkill(Guid id, SkillDto dto)
    {
        var result = await _skillService.UpdateSkillAsync(id, dto);
        return Ok(result);
    }

    [Authorize]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteSkill(Guid id)
    {
        await _skillService.DeleteSkillAsync(id);
        return NoContent();
    }
}
