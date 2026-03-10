using Portfolio.API.Entities;
using Portfolio.API.Application.Features.Bio.DTOs;

namespace Portfolio.API.Application.Features.Bio.Mappers;

public static class BioMapper
{
    public static BioDto ToDto(Entities.Bio bio)
    {
        return new BioDto
        {
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
            SignatureRole = bio.SignatureRole,
            SignatureRole_Ar = bio.SignatureRole_Ar,
            SignatureName = bio.SignatureName,
            SignatureName_Ar = bio.SignatureName_Ar,
            SignatureSubtitle = bio.SignatureSubtitle,
            SignatureSubtitle_Ar = bio.SignatureSubtitle_Ar,
            SignatureVerifiedText = bio.SignatureVerifiedText,
            SignatureVerifiedText_Ar = bio.SignatureVerifiedText_Ar,
            TechnicalFocusTitle = bio.TechnicalFocusTitle,
            TechnicalFocusTitle_Ar = bio.TechnicalFocusTitle_Ar,
            TechnicalFocusDescription = bio.TechnicalFocusDescription,
            TechnicalFocusDescription_Ar = bio.TechnicalFocusDescription_Ar,
            TechnicalFocusItems = bio.TechnicalFocusItems,
            TechnicalFocusItems_Ar = bio.TechnicalFocusItems_Ar
        };
    }

    public static void UpdateEntity(Entities.Bio bio, BioDto dto)
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
    }
}
