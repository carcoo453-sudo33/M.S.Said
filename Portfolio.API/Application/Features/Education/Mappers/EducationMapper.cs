using Portfolio.API.Entities;
using Portfolio.API.Application.Features.Education.DTOs;
using Portfolio.API.Domain.Enums;
using EducationEntity = Portfolio.API.Entities.Education;

namespace Portfolio.API.Application.Features.Education.Mappers;

public static class EducationMapper
{    public static EducationDto ToDto(EducationEntity entity)
    {
        return new EducationDto
        {
            Id = entity.Id,
            Institution = entity.Institution,
            Institution_Ar = entity.Institution_Ar,
            Degree = entity.Degree,
            Degree_Ar = entity.Degree_Ar,
            Duration = entity.Duration,
            Description = entity.Description,
            Description_Ar = entity.Description_Ar,
            Location = entity.Location,
            Location_Ar = entity.Location_Ar,
            ImageUrl = entity.ImageUrl,
            IsCompleted = entity.IsCompleted,
            Category = entity.Category.ToString(),
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt
        };
    }

    public static void UpdateEntity(EducationEntity entity, EducationDto dto)
    {
        entity.Institution = dto.Institution;
        entity.Institution_Ar = dto.Institution_Ar;
        entity.Degree = dto.Degree;
        entity.Degree_Ar = dto.Degree_Ar;
        entity.Duration = dto.Duration;
        entity.Description = dto.Description;
        entity.Description_Ar = dto.Description_Ar;
        entity.Location = dto.Location;
        entity.Location_Ar = dto.Location_Ar;
        entity.ImageUrl = dto.ImageUrl;
        entity.IsCompleted = dto.IsCompleted;
        entity.Category = Enum.TryParse<EducationCategory>(dto.Category, true, out var category) 
            ? category 
            : EducationCategory.Education;
        entity.UpdatedAt = DateTime.UtcNow;
    }
}



