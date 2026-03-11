using Portfolio.API.Entities;
using Portfolio.API.Application.Features.Skills.DTOs;

namespace Portfolio.API.Application.Features.Skills.Mappers;

public class SkillMapper
{
<<<<<<< HEAD
=======
    /// <summary>
    /// Converts a Skill entity into a SkillDto.
    /// </summary>
    /// <param name="entity">The Skill entity to map to a DTO.</param>
    /// <returns>A SkillDto populated with the entity's Id, Name, IconPath, Order, CreatedAt, and UpdatedAt.</returns>
>>>>>>> origin/master
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

<<<<<<< HEAD
=======
    /// <summary>
    /// Updates a Skill entity's mutable fields from a SkillDto.
    /// </summary>
    /// <param name="entity">The Skill entity to modify; updated in place.</param>
    /// <param name="dto">The source DTO providing new values for Name, IconPath, and Order; UpdatedAt will be set to the current UTC time.</param>
>>>>>>> origin/master
    public static void UpdateEntity(Skill entity, SkillDto dto)
    {
        entity.Name = dto.Name;
        entity.IconPath = dto.IconPath;
        entity.Order = dto.Order;
        entity.UpdatedAt = DateTime.UtcNow;
    }
}



