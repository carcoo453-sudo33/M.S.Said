using Microsoft.AspNetCore.Authorization;
using Portfolio.API.Repositories;

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
    public async Task<ActionResult<ExperienceEntry>> CreateExperience(ExperienceEntry entry)
    {
        await _unitOfWork.Repository<ExperienceEntry>().AddAsync(entry);
        await _unitOfWork.CompleteAsync();
        return CreatedAtAction(nameof(GetExperiences), new { id = entry.Id }, entry);
    }
}
