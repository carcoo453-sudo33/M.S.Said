using Portfolio.API.Entities;
using Portfolio.API.Application.Features.Services.DTOs;

namespace Portfolio.API.Application.Features.Services.Mappers;

public class ServiceMapper
{
    public static ServiceDto ToDto(Service entity)
    {
        return new ServiceDto
        {
            Id = entity.Id,
            Title = entity.Title,
            Title_Ar = entity.Title_Ar,
            Description = entity.Description,
            Description_Ar = entity.Description_Ar,
            IconPath = entity.IconPath,
            Order = entity.Order,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt
        };
    }

    public static void UpdateEntity(Service entity, ServiceDto dto)
    {
        entity.Title = dto.Title;
        entity.Title_Ar = dto.Title_Ar;
        entity.Description = dto.Description;
        entity.Description_Ar = dto.Description_Ar;
        entity.IconPath = dto.IconPath;
        entity.Order = dto.Order;
        entity.UpdatedAt = DateTime.UtcNow;
    }
}



