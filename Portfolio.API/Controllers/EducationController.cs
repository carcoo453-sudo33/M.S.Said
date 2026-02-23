using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.API.Entities;
using Portfolio.API.Repositories;
using Portfolio.API.DTOs;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EducationController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public EducationController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<EducationEntry>>> GetEducation()
    {
        var education = await _unitOfWork.Repository<EducationEntry>().GetAllAsync();
        return Ok(education.OrderByDescending(e => e.Duration));
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<EducationEntry>> CreateEducation(EducationDto dto)
    {
        var entry = new EducationEntry
        {
            Id = dto.Id != Guid.Empty ? dto.Id : Guid.NewGuid(),
            Institution = dto.Institution,
            Degree = dto.Degree,
            Duration = dto.Duration,
            Description = dto.Description,
            Location = dto.Location,
            IsCompleted = dto.IsCompleted,
            Category = dto.Category
        };
        await _unitOfWork.Repository<EducationEntry>().AddAsync(entry);
        await _unitOfWork.CompleteAsync();
        return CreatedAtAction(nameof(GetEducation), new { id = entry.Id }, entry);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateEducation(Guid id, EducationDto dto)
    {
        var repository = _unitOfWork.Repository<EducationEntry>();
        var education = await repository.GetByIdAsync(id);
        
        if (education == null) return NotFound();

        education.Institution = dto.Institution;
        education.Degree = dto.Degree;
        education.Duration = dto.Duration;
        education.Description = dto.Description;
        education.Location = dto.Location;
        education.IsCompleted = dto.IsCompleted;
        education.Category = dto.Category;
        education.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.CompleteAsync();
        return Ok(education);
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEducation(Guid id)
    {
        var entry = await _unitOfWork.Repository<EducationEntry>().GetByIdAsync(id);
        if (entry == null) return NotFound();
        _unitOfWork.Repository<EducationEntry>().Delete(entry);
        await _unitOfWork.CompleteAsync();
        return NoContent();
    }
}
