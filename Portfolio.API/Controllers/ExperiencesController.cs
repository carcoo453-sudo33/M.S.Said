using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.API.Entities;
using Portfolio.API.Repositories;
using Portfolio.API.DTOs;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExperiencesController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public ExperiencesController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ExperienceEntry>>> GetExperiences()
    {
        var experiences = await _unitOfWork.Repository<ExperienceEntry>().GetAllAsync();
        return Ok(experiences.OrderByDescending(e => e.Duration));
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ExperienceEntry>> CreateExperience(ExperienceDto dto)
    {
        var entry = new ExperienceEntry
        {
            Id = dto.Id != Guid.Empty ? dto.Id : Guid.NewGuid(),
            Role = dto.Role,
            Company = dto.Company,
            Duration = dto.Duration,
            Description = dto.Description,
            Location = dto.Location,
            IsCurrent = dto.IsCurrent
        };
        await _unitOfWork.Repository<ExperienceEntry>().AddAsync(entry);
        await _unitOfWork.CompleteAsync();
        return CreatedAtAction(nameof(GetExperiences), new { id = entry.Id }, entry);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateExperience(Guid id, ExperienceDto dto)
    {
        var repository = _unitOfWork.Repository<ExperienceEntry>();
        var experience = await repository.GetByIdAsync(id);
        
        if (experience == null) return NotFound();

        experience.Role = dto.Role;
        experience.Company = dto.Company;
        experience.Duration = dto.Duration;
        experience.Description = dto.Description;
        experience.Location = dto.Location;
        experience.IsCurrent = dto.IsCurrent;
        experience.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.CompleteAsync();
        return Ok(experience);
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteExperience(Guid id)
    {
        var experience = await _unitOfWork.Repository<ExperienceEntry>().GetByIdAsync(id);
        if (experience == null) return NotFound();
        _unitOfWork.Repository<ExperienceEntry>().Delete(experience);
        await _unitOfWork.CompleteAsync();
        return NoContent();
    }
}
