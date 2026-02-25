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
        
        // Sort by IsCurrent first (current jobs at top), then by Duration descending
        return Ok(experiences
            .OrderByDescending(e => e.IsCurrent)
            .ThenByDescending(e => ExtractYear(e.Duration))
            .ThenByDescending(e => e.Duration));
    }

    private int ExtractYear(string duration)
    {
        if (string.IsNullOrEmpty(duration)) return 0;
        
        // Handle formats like "05/2024 - Present", "2023", "2022-2023"
        var parts = duration.Split(new[] { '-', '/' }, StringSplitOptions.RemoveEmptyEntries);
        
        foreach (var part in parts)
        {
            var trimmed = part.Trim();
            // Try to find a 4-digit year
            if (int.TryParse(trimmed, out int year) && year >= 2000 && year <= 2100)
            {
                return year;
            }
            // Check if it contains a year (like "05/2024")
            if (trimmed.Length >= 4)
            {
                var lastFour = trimmed.Substring(trimmed.Length - 4);
                if (int.TryParse(lastFour, out int yearFromEnd) && yearFromEnd >= 2000 && yearFromEnd <= 2100)
                {
                    return yearFromEnd;
                }
            }
        }
        
        return 0;
    }

    // [Authorize] // Temporarily disabled for testing
    [HttpPost]
    public async Task<ActionResult<ExperienceEntry>> CreateExperience(ExperienceDto dto)
    {
        var entry = new ExperienceEntry
        {
            Id = dto.Id != Guid.Empty ? dto.Id : Guid.NewGuid(),
            Role = dto.Role,
            Role_Ar = dto.Role_Ar,
            Company = dto.Company,
            Company_Ar = dto.Company_Ar,
            Duration = dto.Duration,
            Description = dto.Description,
            Description_Ar = dto.Description_Ar,
            Location = dto.Location,
            Location_Ar = dto.Location_Ar,
            IsCurrent = dto.IsCurrent
        };
        await _unitOfWork.Repository<ExperienceEntry>().AddAsync(entry);
        await _unitOfWork.CompleteAsync();
        return CreatedAtAction(nameof(GetExperiences), new { id = entry.Id }, entry);
    }

    // [Authorize] // Temporarily disabled for testing
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateExperience(Guid id, ExperienceDto dto)
    {
        var repository = _unitOfWork.Repository<ExperienceEntry>();
        var experience = await repository.GetByIdAsync(id);
        
        if (experience == null) return NotFound();

        experience.Role = dto.Role;
        experience.Role_Ar = dto.Role_Ar;
        experience.Company = dto.Company;
        experience.Company_Ar = dto.Company_Ar;
        experience.Duration = dto.Duration;
        experience.Description = dto.Description;
        experience.Description_Ar = dto.Description_Ar;
        experience.Location = dto.Location;
        experience.Location_Ar = dto.Location_Ar;
        experience.IsCurrent = dto.IsCurrent;
        experience.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.CompleteAsync();
        return Ok(experience);
    }

    // [Authorize] // Temporarily disabled for testing
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
