using Portfolio.API.Entities;
using Portfolio.API.Application.Features.Categories.DTOs;

namespace Portfolio.API.Application.Features.Categories.Mappers;

public class CategoryMapper
{
<<<<<<< HEAD
=======
    /// <summary>
    /// Converts a Category entity to a CategoryDto.
    /// </summary>
    /// <param name="entity">The Category entity to convert.</param>
    /// <returns>A CategoryDto containing the entity's Id, Name, Name_Ar, CreatedAt, and UpdatedAt.</returns>
>>>>>>> origin/master
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

<<<<<<< HEAD
=======
    /// <summary>
    /// Updates a Category entity's mutable fields from a CategoryDto.
    /// </summary>
    /// <param name="entity">The Category entity to update in place.</param>
    /// <param name="dto">The source DTO containing new values for the entity's fields.</param>
    /// <remarks>Sets the entity's Name and Name_Ar from the DTO and updates UpdatedAt to the current UTC time.</remarks>
>>>>>>> origin/master
    public static void UpdateEntity(Category entity, CategoryDto dto)
    {
        entity.Name = dto.Name;
        entity.Name_Ar = dto.Name_Ar;
        entity.UpdatedAt = DateTime.UtcNow;
    }
}



