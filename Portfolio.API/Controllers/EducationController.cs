using Portfolio.API.Repositories;

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
}
