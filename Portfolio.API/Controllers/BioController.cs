using Microsoft.AspNetCore.Mvc;
using Portfolio.API.Entities;
using Portfolio.API.Repositories;
using Portfolio.API.DTOs;

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
        
        if (bio == null) 
        {
            return Ok(new BioEntry 
            { 
                Id = Guid.NewGuid(),
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
        var repository = _unitOfWork.Repository<BioEntry>();
        var bio = (await repository.GetAllAsync()).FirstOrDefault();
        
        if (bio == null)
        {
            bio = new BioEntry { Id = id };
            await repository.AddAsync(bio);
        }

        // Map DTO to Entity manually (avoids tracking issues)
        bio.Name = dto.Name;
        bio.Title = dto.Title;
        bio.Description = dto.Description;
        bio.Location = dto.Location;
        bio.Email = dto.Email;
        bio.Phone = dto.Phone;
        bio.AvatarUrl = dto.AvatarUrl;
        bio.LinkedInUrl = dto.LinkedInUrl;
        bio.GitHubUrl = dto.GitHubUrl;
        bio.WhatsAppUrl = dto.WhatsAppUrl;
        bio.CVUrl = dto.CVUrl;
        bio.TwitterUrl = dto.TwitterUrl;
        bio.YearsOfExperience = dto.YearsOfExperience;
        bio.ProjectsCompleted = dto.ProjectsCompleted;
        bio.CodeCommits = dto.CodeCommits;
        bio.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.CompleteAsync();
        return Ok(bio);
    }
}
