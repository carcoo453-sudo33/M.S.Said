using Portfolio.API.Entities;
using Portfolio.API.Application.Features.Bio.DTOs;

namespace Portfolio.API.Application.Features.Bio.Mappers;

public static class SignatureMapper
{
    public static SignatureDto ToDto(Signature signature)
    {
        return new SignatureDto
        {
            Id = signature.Id,
            BioId = signature.BioId,
            Role = signature.Role,
            Role_Ar = signature.Role_Ar,
            Name = signature.Name,
            Name_Ar = signature.Name_Ar,
            Subtitle = signature.Subtitle,
            Subtitle_Ar = signature.Subtitle_Ar,
            VerifiedText = signature.VerifiedText,
            VerifiedText_Ar = signature.VerifiedText_Ar
        };
    }

    public static Signature ToEntity(SignatureDto dto, Guid bioId)
    {
        return new Signature
        {
            BioId = bioId,
            Role = dto.Role,
            Role_Ar = dto.Role_Ar,
            Name = dto.Name,
            Name_Ar = dto.Name_Ar,
            Subtitle = dto.Subtitle,
            Subtitle_Ar = dto.Subtitle_Ar,
            VerifiedText = dto.VerifiedText,
            VerifiedText_Ar = dto.VerifiedText_Ar
        };
    }

    public static void UpdateEntity(Signature signature, SignatureDto dto)
    {
        signature.Role = dto.Role;
        signature.Role_Ar = dto.Role_Ar;
        signature.Name = dto.Name;
        signature.Name_Ar = dto.Name_Ar;
        signature.Subtitle = dto.Subtitle;
        signature.Subtitle_Ar = dto.Subtitle_Ar;
        signature.VerifiedText = dto.VerifiedText;
        signature.VerifiedText_Ar = dto.VerifiedText_Ar;
        signature.UpdatedAt = DateTime.UtcNow;
    }
}



