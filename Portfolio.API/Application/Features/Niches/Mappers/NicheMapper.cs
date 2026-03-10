using Portfolio.API.Entities;
using Portfolio.API.Application.Features.Niches.DTOs;

namespace Portfolio.API.Application.Features.Niches.Mappers;

public class NicheMapper
{
    public static NicheDto ToDto(Niche entity)
    {
        return new NicheDto
        {
            Id = entity.Id,
            Name = entity.Name,
            Name_Ar = entity.Name_Ar,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt
        };
    }

    public static void UpdateEntity(Niche entity, NicheDto dto)
    {
        entity.Name = dto.Name;
        entity.Name_Ar = dto.Name_Ar;
        entity.UpdatedAt = DateTime.UtcNow;
    }
}



