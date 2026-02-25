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
        bio.Name_Ar = dto.Name_Ar;
        bio.Title = dto.Title;
        bio.Title_Ar = dto.Title_Ar;
        bio.Description = dto.Description;
        bio.Description_Ar = dto.Description_Ar;
        bio.Location = dto.Location;
        bio.Location_Ar = dto.Location_Ar;
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
        bio.EducationQuote = dto.EducationQuote;
        bio.EducationQuote_Ar = dto.EducationQuote_Ar;
        bio.SignatureRole = dto.SignatureRole;
        bio.SignatureRole_Ar = dto.SignatureRole_Ar;
        bio.SignatureName = dto.SignatureName;
        bio.SignatureName_Ar = dto.SignatureName_Ar;
        bio.SignatureSubtitle = dto.SignatureSubtitle;
        bio.SignatureSubtitle_Ar = dto.SignatureSubtitle_Ar;
        bio.SignatureVerifiedText = dto.SignatureVerifiedText;
        bio.SignatureVerifiedText_Ar = dto.SignatureVerifiedText_Ar;
        bio.TechnicalFocusTitle = dto.TechnicalFocusTitle;
        bio.TechnicalFocusTitle_Ar = dto.TechnicalFocusTitle_Ar;
        bio.TechnicalFocusDescription = dto.TechnicalFocusDescription;
        bio.TechnicalFocusDescription_Ar = dto.TechnicalFocusDescription_Ar;
        bio.TechnicalFocusItems = dto.TechnicalFocusItems;
        bio.TechnicalFocusItems_Ar = dto.TechnicalFocusItems_Ar;
        bio.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.CompleteAsync();
        return Ok(bio);
    }
}
