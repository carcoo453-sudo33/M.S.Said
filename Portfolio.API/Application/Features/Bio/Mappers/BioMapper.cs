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
            Name = bio.Name,
            Name_Ar = bio.Name_Ar,
            Title = bio.Title,
            Title_Ar = bio.Title_Ar,
            Description = bio.Description,
            Description_Ar = bio.Description_Ar,
            Location = bio.Location,
            Location_Ar = bio.Location_Ar,
            Email = bio.Email,
            Phone = bio.Phone,
            AvatarUrl = bio.AvatarUrl,
            LinkedInUrl = bio.LinkedInUrl,
            GitHubUrl = bio.GitHubUrl,
            WhatsAppUrl = bio.WhatsAppUrl,
            CVUrl = bio.CVUrl,
            TwitterUrl = bio.TwitterUrl,
            YearsOfExperience = bio.YearsOfExperience,
            ProjectsCompleted = bio.ProjectsCompleted,
            CodeCommits = bio.CodeCommits,
            EducationQuote = bio.EducationQuote,
            EducationQuote_Ar = bio.EducationQuote_Ar,
            Signature = bio.Signature != null ? SignatureMapper.ToDto(bio.Signature) : null,
            TechnicalFocus = bio.TechnicalFocus != null ? TechnicalFocusMapper.ToDto(bio.TechnicalFocus) : null
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
        // Note: YearsOfExperience, ProjectsCompleted, and CodeCommits are calculated dynamically in the service
        bio.EducationQuote = dto.EducationQuote;
        bio.EducationQuote_Ar = dto.EducationQuote_Ar;
        
        // Handle Signature
        if (dto.Signature != null)
        {
            if (bio.Signature == null)
            {
                bio.Signature = SignatureMapper.ToEntity(dto.Signature, bio.Id);
            }
            else
            {
                SignatureMapper.UpdateEntity(bio.Signature, dto.Signature);
            }
        }
        else
        {
            bio.Signature = null;
        }

        // Handle TechnicalFocus
        if (dto.TechnicalFocus != null)
        {
            if (bio.TechnicalFocus == null)
            {
                bio.TechnicalFocus = TechnicalFocusMapper.ToEntity(dto.TechnicalFocus, bio.Id);
            }
            else
            {
                TechnicalFocusMapper.UpdateEntity(bio.TechnicalFocus, dto.TechnicalFocus);
            }
        }
        else
        {
            bio.TechnicalFocus = null;
        }
        bio.UpdatedAt = DateTime.UtcNow;
    }
}



