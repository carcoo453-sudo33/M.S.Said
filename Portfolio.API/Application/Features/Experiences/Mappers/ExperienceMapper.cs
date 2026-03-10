using Portfolio.API.Entities;
using Portfolio.API.Application.Features.Experiences.DTOs;

namespace Portfolio.API.Application.Features.Experiences.Mappers;

public class ExperienceMapper
{
    public static ExperienceDto ToDto(Education entity)
    {
        return new ExperienceDto
        {
            Id = entity.Id,
            Company = entity.Institution,
            Company_Ar = entity.Institution_Ar,
            Role = entity.Degree,
            Role_Ar = entity.Degree_Ar,
            Duration = entity.Duration,
            Description = entity.Description,
            Description_Ar = entity.Description_Ar,
            Location = entity.Location,
            Location_Ar = entity.Location_Ar,
            IsCurrent = entity.IsCompleted,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt
        };
    }

    public static void UpdateEntity(Education entity, ExperienceDto dto)
    {
        entity.Institution = dto.Company;
        entity.Institution_Ar = dto.Company_Ar;
        entity.Degree = dto.Role;
        entity.Degree_Ar = dto.Role_Ar;
        entity.Duration = dto.Duration;
        entity.Description = dto.Description;
        entity.Description_Ar = dto.Description_Ar;
        entity.Location = dto.Location;
        entity.Location_Ar = dto.Location_Ar;
        entity.IsCompleted = dto.IsCurrent;
        entity.UpdatedAt = DateTime.UtcNow;
    }
}



