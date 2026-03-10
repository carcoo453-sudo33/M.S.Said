using Portfolio.API.Entities;
using Portfolio.API.Application.Features.Niches.DTOs;

namespace Portfolio.API.Application.Features.Niches.Mappers;

public static class NicheMapper{
    public static NicheDto ToDto(Niche entity)
    {
        ArgumentNullException.ThrowIfNull(entity);
        return new NicheDto(
            entity.Id,
            entity.Name,
            entity.Name_Ar,
            entity.CreatedAt,
            entity.UpdatedAt
        );
    }

    public static void UpdateEntity(Niche entity, NicheDto dto)
    {
        entity.Name = dto.Name;
        entity.Name_Ar = dto.Name_Ar;
        entity.UpdatedAt = DateTime.UtcNow;
    }
}



