using Microsoft.AspNetCore.Mvc;
using Portfolio.API.Application.Features.Bio.DTOs;
using Portfolio.API.Application.Features.Bio.Services;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BioController : ControllerBase
{
    private readonly IBioService _bioService;

    public BioController(IBioService bioService)
    {
        _bioService = bioService;
    }

    [HttpGet]
    public async Task<ActionResult<BioDto>> GetBio()
    {
        var bio = await _bioService.GetBioAsync();
        
        if (bio == null) 
        {
            return NotFound("User profile bio not populated yet");
        }
        
        return Ok(bio);
    }

    [Microsoft.AspNetCore.Authorization.Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBio(Guid id, BioDto dto)
    {
        var result = await _bioService.UpdateBioAsync(id, dto);
        return Ok(result);
    }
}
