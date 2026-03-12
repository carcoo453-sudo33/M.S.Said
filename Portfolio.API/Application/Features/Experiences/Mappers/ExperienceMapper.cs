using Portfolio.API.Entities;
using Portfolio.API.Application.Features.Experiences.DTOs;

namespace Portfolio.API.Application.Features.Experiences.Mappers;

public class ExperienceMapper
{
    /// <summary>
    /// Maps an Experience entity to an ExperienceDto by copying corresponding fields.
    /// </summary>
    /// <param name="entity">The experience entity to convert.</param>
    /// <returns>An ExperienceDto populated from the entity's fields.</returns>
    public static ExperienceDto ToDto(Experience entity)
    {
        return new ExperienceDto
        {
            Id = entity.Id,
            Company = entity.Company,
            Company_Ar = entity.Company_Ar,
            Role = entity.Role,
            Role_Ar = entity.Role_Ar,
            Duration = entity.Duration,
            Description = entity.Description,
            Description_Ar = entity.Description_Ar,
            Location = entity.Location,
            Location_Ar = entity.Location_Ar,
            IsCurrent = entity.IsCurrent,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt
        };
    }

    /// <summary>
    /// Updates the provided Experience entity with values from the ExperienceDto and sets the entity's UpdatedAt to the current UTC time.
    /// </summary>
    /// <param name="entity">The Experience entity to update.</param>
    /// <param name="dto">The ExperienceDto containing new values to apply to the entity.</param>
    public static void UpdateEntity(Experience entity, ExperienceDto dto)
    {
        entity.Company = dto.Company;
        entity.Company_Ar = dto.Company_Ar;
        entity.Role = dto.Role;
        entity.Role_Ar = dto.Role_Ar;
        entity.Duration = dto.Duration;
        entity.Description = dto.Description;
        entity.Description_Ar = dto.Description_Ar;
        entity.Location = dto.Location;
        entity.Location_Ar = dto.Location_Ar;
        entity.IsCurrent = dto.IsCurrent;
        entity.UpdatedAt = DateTime.UtcNow;
    }
}



