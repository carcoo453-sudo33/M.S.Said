using Portfolio.API.Entities;
using Portfolio.API.Application.Features.Bio.DTOs;

namespace Portfolio.API.Application.Features.Bio.Mappers;

public static class TechnicalFocusMapper
{
    /// <summary>
    /// Maps a TechnicalFocus entity to a TechnicalFocusDto.
    /// </summary>
    /// <param name="technicalFocus">The TechnicalFocus entity to convert.</param>
    /// <returns>A new TechnicalFocusDto with properties copied from the provided entity.</returns>
    public static TechnicalFocusDto ToDto(TechnicalFocus technicalFocus)
    {
        return new TechnicalFocusDto
        {
            Id = technicalFocus.Id,
            BioId = technicalFocus.BioId,
            Title = technicalFocus.Title,
            Title_Ar = technicalFocus.Title_Ar,
            Description = technicalFocus.Description,
            Description_Ar = technicalFocus.Description_Ar,
            Items = technicalFocus.Items,
            Items_Ar = technicalFocus.Items_Ar
        };
    }

    /// <summary>
    /// Create a TechnicalFocus entity from a TechnicalFocusDto and associate it with the specified Bio ID.
    /// </summary>
    /// <param name="dto">Source DTO containing title, description and item values to copy into the entity.</param>
    /// <param name="bioId">Identifier of the parent Bio to assign to the new entity.</param>
    /// <returns>A new TechnicalFocus with properties copied from <paramref name="dto"/> and <paramref name="bioId"/> assigned to its BioId.</returns>
    public static TechnicalFocus ToEntity(TechnicalFocusDto dto, Guid bioId)
    {
        return new TechnicalFocus
        {
            BioId = bioId,
            Title = dto.Title,
            Title_Ar = dto.Title_Ar,
            Description = dto.Description,
            Description_Ar = dto.Description_Ar,
            Items = dto.Items,
            Items_Ar = dto.Items_Ar
        };
    }

    /// <summary>
    /// Updates the given TechnicalFocus entity's fields from the provided DTO and records the current UTC update time.
    /// </summary>
    /// <param name="technicalFocus">The existing entity to update; its properties will be modified in-place.</param>
    /// <param name="dto">The data transfer object supplying new values for the entity's title, description, and items (including Arabic variants).</param>
    public static void UpdateEntity(TechnicalFocus technicalFocus, TechnicalFocusDto dto)
    {
        technicalFocus.Title = dto.Title;
        technicalFocus.Title_Ar = dto.Title_Ar;
        technicalFocus.Description = dto.Description;
        technicalFocus.Description_Ar = dto.Description_Ar;
        technicalFocus.Items = dto.Items;
        technicalFocus.Items_Ar = dto.Items_Ar;
        technicalFocus.UpdatedAt = DateTime.UtcNow;
    }
}



