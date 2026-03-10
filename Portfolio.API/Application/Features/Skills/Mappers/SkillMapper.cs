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
            Name_Ar = entity.Name_Ar,
            Icon = entity.Icon,
            Order = entity.Order,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt
        };
    }

    public static void UpdateEntity(Skill entity, SkillDto dto)
    {
        entity.Name = dto.Name;
        entity.Name_Ar = dto.Name_Ar;
        entity.Icon = dto.Icon;
        entity.Order = dto.Order;
        entity.UpdatedAt = DateTime.UtcNow;
    }
}
