using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.API.Entities;
using Portfolio.API.Repositories;
using Portfolio.API.DTOs;
using Portfolio.API.Enums;

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
    public async Task<ActionResult<IEnumerable<Education>>> GetEducation()
    {
        var education = await _unitOfWork.Repository<Education>().GetAllAsync();
        return Ok(education.OrderByDescending(e => e.Duration));
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<Education>> CreateEducation(EducationDto dto)
    {
        var entry = new Education
        {
            Id = dto.Id != Guid.Empty ? dto.Id : Guid.NewGuid(),
            Institution = dto.Institution,
            Institution_Ar = dto.Institution_Ar,
            Degree = dto.Degree,
            Degree_Ar = dto.Degree_Ar,
            Duration = dto.Duration,
            Description = dto.Description,
            Description_Ar = dto.Description_Ar,
            Location = dto.Location,
            Location_Ar = dto.Location_Ar,
            ImageUrl = dto.ImageUrl,
            IsCompleted = dto.IsCompleted,
            Category = Enum.TryParse<EducationCategory>(dto.Category, true, out var category) ? category : EducationCategory.Education
        };
        await _unitOfWork.Repository<Education>().AddAsync(entry);
        await _unitOfWork.CompleteAsync();
        return CreatedAtAction(nameof(GetEducation), new { id = entry.Id }, entry);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateEducation(Guid id, EducationDto dto)
    {
        var repository = _unitOfWork.Repository<Education>();
        var education = await repository.GetByIdAsync(id);
        
        if (education == null) return NotFound();

        education.Institution = dto.Institution;
        education.Institution_Ar = dto.Institution_Ar;
        education.Degree = dto.Degree;
        education.Degree_Ar = dto.Degree_Ar;
        education.Duration = dto.Duration;
        education.Description = dto.Description;
        education.Description_Ar = dto.Description_Ar;
        education.Location = dto.Location;
        education.Location_Ar = dto.Location_Ar;
        education.ImageUrl = dto.ImageUrl;
        education.IsCompleted = dto.IsCompleted;
        education.Category = Enum.TryParse<EducationCategory>(dto.Category, true, out var category) ? category : EducationCategory.Education;
        education.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.CompleteAsync();
        return Ok(education);
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEducation(Guid id)
    {
        var entry = await _unitOfWork.Repository<Education>().GetByIdAsync(id);
        if (entry == null) return NotFound();
        _unitOfWork.Repository<Education>().Delete(entry);
        await _unitOfWork.CompleteAsync();
        return NoContent();
    }
}
