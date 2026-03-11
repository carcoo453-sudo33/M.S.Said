using Portfolio.API.Entities;
using Portfolio.API.Application.Features.Niches.DTOs;

namespace Portfolio.API.Application.Features.Niches.Mappers;

public static class NicheMapper
{
<<<<<<< HEAD
=======
    /// <summary>
    /// Creates a <see cref="NicheDto"/> from the provided <see cref="Niche"/> entity.
    /// </summary>
    /// <param name="entity">The source <see cref="Niche"/> to convert; must not be null.</param>
    /// <returns>A <see cref="NicheDto"/> populated with the entity's Id, Name, Name_Ar, CreatedAt, and UpdatedAt.</returns>
    /// <exception cref="ArgumentNullException">Thrown when <paramref name="entity"/> is null.</exception>
>>>>>>> origin/master
    public static NicheDto ToDto(Niche entity)
    {
        ArgumentNullException.ThrowIfNull(entity);
        return new NicheDto(
            entity.Id,
            entity.Name,
            entity.Name_Ar,
            entity.CreatedAt,
            entity.UpdatedAt
        );
    }

<<<<<<< HEAD
=======
    /// <summary>
    /// Updates the specified Niche entity's name fields from the provided DTO and sets its UpdatedAt timestamp to the current UTC time.
    /// </summary>
    /// <param name="entity">The existing Niche entity to update; its Name, Name_Ar, and UpdatedAt will be modified.</param>
    /// <param name="dto">The source DTO supplying the Name and Name_Ar values.</param>
>>>>>>> origin/master
    public static void UpdateEntity(Niche entity, NicheDto dto)
    {
        entity.Name = dto.Name;
        entity.Name_Ar = dto.Name_Ar;
        entity.UpdatedAt = DateTime.UtcNow;
    }
}



