using Portfolio.API.Entities;
using Portfolio.API.Application.Features.Categories.DTOs;

namespace Portfolio.API.Application.Features.Categories.Mappers;

public class CategoryMapper
{
    public static CategoryDto ToDto(Category entity)
    {
        return new CategoryDto
        {
            Id = entity.Id,
            Name = entity.Name,
            Name_Ar = entity.Name_Ar,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt
        };
    }

    public static void UpdateEntity(Category entity, CategoryDto dto)
    {
        entity.Name = dto.Name;
        entity.Name_Ar = dto.Name_Ar;
        entity.UpdatedAt = DateTime.UtcNow;
    }
}



