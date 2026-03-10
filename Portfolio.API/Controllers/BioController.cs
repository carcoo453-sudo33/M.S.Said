using Microsoft.AspNetCore.Mvc;
using Portfolio.API.Application.Features.Bio.DTOs;
using Portfolio.API.Application.Features.Bio.Services;
using Portfolio.API.Entities;

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
            return Ok(new BioDto 
            { 
                Name = "Default User",
                Title = "Please edit profile to update",
                Email = "email@example.com",
                Description = "Default description..."
            });
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
