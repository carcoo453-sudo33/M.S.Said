using Portfolio.API.Entities;
using Portfolio.API.Application.Features.Education.DTOs;
using Portfolio.API.Domain.Enums;
using EducationEntity = Portfolio.API.Entities.Education;

namespace Portfolio.API.Application.Features.Education.Mappers;

public static class EducationMapper
{
<<<<<<< HEAD
=======
    /// <summary>
    /// Maps an EducationEntity to an EducationDto.
    /// </summary>
    /// <param name="entity">The source EducationEntity to convert; must not be null.</param>
    /// <returns>An EducationDto populated with values copied from the entity, with Category converted to its string representation.</returns>
    /// <exception cref="ArgumentNullException">Thrown when <paramref name="entity"/> is null.</exception>
>>>>>>> origin/master
    public static EducationDto ToDto(EducationEntity entity)
    {
        ArgumentNullException.ThrowIfNull(entity);
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

<<<<<<< HEAD
=======
    /// <summary>
    —Updates an EducationEntity's mutable fields with values taken from an EducationDto.
    /// </summary>
    /// <param name="entity">The EducationEntity to update; fields are modified in place.</param>
    /// <param name="dto">The source EducationDto containing new values to apply.</param>
    /// <remarks>
    /// Copies scalar properties (Institution, Degree, Duration, Description, Location, ImageUrl, IsCompleted and their localized variants) from <paramref name="dto"/> to <paramref name="entity"/>.
    /// Attempts a case-insensitive parse of <c>dto.Category</c> into <see cref="EducationCategory"/>; if parsing fails, sets <c>entity.Category</c> to <c>EducationCategory.Education</c>. Sets <c>entity.UpdatedAt</c> to the current UTC time.
    /// </remarks>
>>>>>>> origin/master
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


