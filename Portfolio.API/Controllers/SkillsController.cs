using Microsoft.AspNetCore.Mvc;
using Portfolio.API.Entities;
using Portfolio.API.Repositories;

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
}
