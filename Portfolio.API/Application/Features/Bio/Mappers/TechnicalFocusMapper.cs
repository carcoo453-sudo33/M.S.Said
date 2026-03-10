using Portfolio.API.Entities;
using Portfolio.API.Application.Features.Bio.DTOs;

namespace Portfolio.API.Application.Features.Bio.Mappers;

public static class TechnicalFocusMapper
{
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



