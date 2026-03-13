using Portfolio.API.Entities;
using Portfolio.API.Application.Features.Bio.DTOs;
using BioEntity = Portfolio.API.Entities.Bio;

namespace Portfolio.API.Application.Features.Bio.Mappers;

public static class BioMapper
{
    /// <summary>
    /// Create a BioDto from a BioEntity by mapping scalar properties and converting nested Signature and TechnicalFocus when present.
    /// </summary>
    /// <param name="bio">The source BioEntity to convert.</param>
    /// <returns>A BioDto whose scalar fields are copied from the source and whose Signature and TechnicalFocus are mapped when present (null if absent).</returns>
    public static BioDto ToDto(BioEntity bio)
    {
        return new BioDto
        {
            Id = bio.Id,
            Name = bio.Name ?? string.Empty,
            Name_Ar = bio.Name_Ar ?? string.Empty,
            Title = bio.Title ?? string.Empty,
            Title_Ar = bio.Title_Ar ?? string.Empty,
            Description = bio.Description ?? string.Empty,
            Description_Ar = bio.Description_Ar ?? string.Empty,
            Location = bio.Location ?? string.Empty,
            Location_Ar = bio.Location_Ar ?? string.Empty,
            Email = bio.Email ?? string.Empty,
            Phone = bio.Phone ?? string.Empty,
            AvatarUrl = bio.AvatarUrl ?? string.Empty,
            LinkedInUrl = bio.LinkedInUrl ?? string.Empty,
            GitHubUrl = bio.GitHubUrl ?? string.Empty,
            WhatsAppUrl = bio.WhatsAppUrl ?? string.Empty,
            CVUrl = bio.CVUrl ?? string.Empty,
            TwitterUrl = bio.TwitterUrl ?? string.Empty,
            FacebookUrl = bio.FacebookUrl ?? string.Empty,
            DevToUrl = bio.DevToUrl ?? string.Empty,
            PinterestUrl = bio.PinterestUrl ?? string.Empty,
            StackOverflowUrl = bio.StackOverflowUrl ?? string.Empty,
            CareerStartDate = bio.CareerStartDate,
            GitHubUsername = bio.GitHubUsername ?? string.Empty,
            YearsOfExperience = bio.YearsOfExperience ?? string.Empty,
            ProjectsCompleted = bio.ProjectsCompleted ?? string.Empty,
            CodeCommits = bio.CodeCommits ?? string.Empty,
            EducationQuote = bio.EducationQuote ?? string.Empty,
            EducationQuote_Ar = bio.EducationQuote_Ar ?? string.Empty,
            Signature = bio.Signature != null ? SignatureMapper.ToDto(bio.Signature) : new SignatureDto(),
            TechnicalFocus = bio.TechnicalFocus != null ? TechnicalFocusMapper.ToDto(bio.TechnicalFocus) : new TechnicalFocusDto()
        };
    }

    /// <summary>
    /// Updates the target BioEntity's properties from the supplied BioDto, applying defaults for certain string fields and synchronizing nested Signature and TechnicalFocus objects.
    /// </summary>
    /// <param name="bio">The existing BioEntity to update.</param>
    /// <param name="dto">The source BioDto containing new values.</param>
    /// <remarks>
    /// - Uses empty string defaults for Title, Description, Location, Email, and Phone when the corresponding dto values are null.
    /// - If dto.Signature is non-null, creates a new Signature entity when bio.Signature is null or updates the existing one; if dto.Signature is null, sets bio.Signature to null.
    /// - If dto.TechnicalFocus is non-null, creates a new TechnicalFocus entity when bio.TechnicalFocus is null or updates the existing one; if dto.TechnicalFocus is null, sets bio.TechnicalFocus to null.
    /// - Sets bio.UpdatedAt to the current UTC time.
    /// - Does not update YearsOfExperience, ProjectsCompleted, or CodeCommits (these are calculated dynamically elsewhere).
    /// </remarks>
    public static void UpdateEntity(BioEntity bio, BioDto dto)
    {
        bio.Name = dto.Name;
        bio.Name_Ar = dto.Name_Ar;
        bio.Title = dto.Title ?? string.Empty;
        bio.Title_Ar = dto.Title_Ar;
        bio.Description = dto.Description ?? string.Empty;
        bio.Description_Ar = dto.Description_Ar;
        bio.Location = dto.Location ?? string.Empty;
        bio.Location_Ar = dto.Location_Ar;
        bio.Email = dto.Email ?? string.Empty;
        bio.Phone = dto.Phone ?? string.Empty;
        bio.AvatarUrl = dto.AvatarUrl;
        bio.LinkedInUrl = dto.LinkedInUrl;
        bio.GitHubUrl = dto.GitHubUrl;
        bio.WhatsAppUrl = dto.WhatsAppUrl;
        bio.CVUrl = dto.CVUrl;
        bio.TwitterUrl = dto.TwitterUrl;
        bio.FacebookUrl = dto.FacebookUrl;
        bio.DevToUrl = dto.DevToUrl;
        bio.PinterestUrl = dto.PinterestUrl;
        bio.StackOverflowUrl = dto.StackOverflowUrl;
        bio.CareerStartDate = dto.CareerStartDate;
        bio.GitHubUsername = dto.GitHubUsername;
        // Note: YearsOfExperience, ProjectsCompleted, and CodeCommits are calculated dynamically in the service
        bio.EducationQuote = dto.EducationQuote;
        bio.EducationQuote_Ar = dto.EducationQuote_Ar;
        
        // Handle Signature - update in-place if exists, otherwise create new
        if (dto.Signature != null)
        {
            if (bio.Signature != null)
            {
                SignatureMapper.UpdateEntity(bio.Signature, dto.Signature);
            }
            else
            {
                bio.Signature = SignatureMapper.ToEntity(dto.Signature, bio.Id);
            }
        }
        else
        {
            bio.Signature = null;
        }

        // Handle TechnicalFocus - update in-place if exists, otherwise create new
        if (dto.TechnicalFocus != null)
        {
            if (bio.TechnicalFocus != null)
            {
                TechnicalFocusMapper.UpdateEntity(bio.TechnicalFocus, dto.TechnicalFocus);
            }
            else
            {
                bio.TechnicalFocus = TechnicalFocusMapper.ToEntity(dto.TechnicalFocus, bio.Id);
            }
        }
        else
        {
            bio.TechnicalFocus = null;
        }
        bio.UpdatedAt = DateTime.UtcNow;
    }
}



