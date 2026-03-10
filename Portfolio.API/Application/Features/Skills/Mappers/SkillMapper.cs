using Portfolio.API.Entities;
using Portfolio.API.Application.Features.Skills.DTOs;

namespace Portfolio.API.Application.Features.Skills.Mappers;

public class SkillMapper
{
    public static SkillDto ToDto(Skill entity)
    {
        return new SkillDto
        {
            Id = entity.Id,
            Name = entity.Name,
            IconPath = entity.IconPath,
            Order = entity.Order,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt
        };
    }

    public static void UpdateEntity(Skill entity, SkillDto dto)
    {
        entity.Name = dto.Name;
        entity.IconPath = dto.IconPath;
        entity.Order = dto.Order;
        entity.UpdatedAt = DateTime.UtcNow;
    }
}



