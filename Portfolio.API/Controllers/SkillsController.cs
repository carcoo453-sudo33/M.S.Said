using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.API.Entities;
using Portfolio.API.Repositories;
using Portfolio.API.DTOs;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SkillsController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public SkillsController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SkillEntry>>> GetSkills()
    {
        var skills = await _unitOfWork.Repository<SkillEntry>().GetAllAsync();
        return Ok(skills.OrderBy(s => s.Order));
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<SkillEntry>> CreateSkill(SkillDto dto)
    {
        var entry = new SkillEntry
        {
            Id = dto.Id != Guid.Empty ? dto.Id : Guid.NewGuid(),
            Name = dto.Name,
            Icon = dto.Icon,
            Order = dto.Order
        };
        await _unitOfWork.Repository<SkillEntry>().AddAsync(entry);
        await _unitOfWork.CompleteAsync();
        return CreatedAtAction(nameof(GetSkills), new { id = entry.Id }, entry);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSkill(Guid id, SkillDto dto)
    {
        var repository = _unitOfWork.Repository<SkillEntry>();
        var skill = await repository.GetByIdAsync(id);
        
        if (skill == null) return NotFound();

        skill.Name = dto.Name;
        skill.Icon = dto.Icon;
        skill.Order = dto.Order;
        skill.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.CompleteAsync();
        return Ok(skill);
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSkill(Guid id)
    {
        var skill = await _unitOfWork.Repository<SkillEntry>().GetByIdAsync(id);
        if (skill == null) return NotFound();
        _unitOfWork.Repository<SkillEntry>().Delete(skill);
        await _unitOfWork.CompleteAsync();
        return NoContent();
    }
}
