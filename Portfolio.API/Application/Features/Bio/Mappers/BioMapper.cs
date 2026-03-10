using Portfolio.API.Entities;
using Portfolio.API.Application.Features.Bio.DTOs;

namespace Portfolio.API.Application.Features.Bio.Mappers;

public static class BioMapper
{
    public static BioDto ToDto(Bio bio)
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

    public static void UpdateEntity(Bio bio, BioDto dto)
    {
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

        bio.UpdatedAt = DateTime.UtcNow;
    }
}



