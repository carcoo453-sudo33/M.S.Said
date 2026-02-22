using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.API.Data;
using Portfolio.API.Entities;

using Microsoft.AspNetCore.Mvc;
using Portfolio.API.Entities;
using Portfolio.API.Repositories;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BioController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public BioController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    public async Task<ActionResult<BioEntry>> GetBio()
    {
        var bio = (await _unitOfWork.Repository<BioEntry>().GetAllAsync()).FirstOrDefault();
        if (bio == null) return NotFound();
        return bio;
    }
}
