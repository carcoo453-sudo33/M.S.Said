using Portfolio.API.Entities;
using Portfolio.API.Application.Features.Bio.DTOs;

namespace Portfolio.API.Application.Features.Bio.Mappers;

public static class SignatureMapper
{
    /// <summary>
    /// Maps a Signature entity to a SignatureDto.
    /// </summary>
    /// <param name="signature">The Signature entity to map.</param>
    /// <returns>A SignatureDto with values copied from the provided Signature entity.</returns>
    public static SignatureDto ToDto(Signature signature)
    {
        return new SignatureDto
        {
            Id = signature.Id,
            BioId = signature.BioId,
            Role = signature.Role ?? string.Empty,
            Role_Ar = signature.Role_Ar ?? string.Empty,
            Name = signature.Name ?? string.Empty,
            Name_Ar = signature.Name_Ar ?? string.Empty,
            Subtitle = signature.Subtitle ?? string.Empty,
            Subtitle_Ar = signature.Subtitle_Ar ?? string.Empty,
            VerifiedText = signature.VerifiedText ?? string.Empty,
            VerifiedText_Ar = signature.VerifiedText_Ar ?? string.Empty
        };
    }

    /// <summary>
    /// Create a new Signature entity from a SignatureDto and associate it with the specified bio.
    /// </summary>
    /// <param name="dto">DTO containing signature fields to copy into the entity.</param>
    /// <param name="bioId">Identifier of the parent Bio to assign to the new entity's BioId.</param>
    /// <returns>A Signature entity with properties mapped from <paramref name="dto"/> and BioId set to <paramref name="bioId"/>.</returns>
    public static Signature ToEntity(SignatureDto dto, Guid bioId)
    {
        return new Signature
        {
            Id = Guid.Empty,
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

    /// <summary>
    /// Updates an existing Signature entity with values from a SignatureDto.
    /// </summary>
    /// <param name="signature">The Signature entity to be updated in place.</param>
    /// <param name="dto">The DTO providing new property values to apply to the entity; matching fields are copied.</param>
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



