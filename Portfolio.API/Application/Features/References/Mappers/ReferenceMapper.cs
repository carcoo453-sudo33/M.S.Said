using Portfolio.API.Entities;
using Portfolio.API.Application.Features.References.DTOs;

namespace Portfolio.API.Application.Features.References.Mappers;

public class ReferenceMapper
{
    /// <summary>
    /// Create a ReferenceDto whose properties mirror the provided Reference entity.
    /// </summary>
    /// <param name="entity">The source Reference entity to map from.</param>
    /// <returns>A ReferenceDto with values copied from the entity.</returns>
    /// <exception cref="System.ArgumentNullException">Thrown when <paramref name="entity"/> is null.</exception>
    public static ReferenceDto ToDto(Reference entity)
    {
        ArgumentNullException.ThrowIfNull(entity);
        return new ReferenceDto
        {
            Id = entity.Id,
            Name = entity.Name,
            Name_Ar = entity.Name_Ar ?? string.Empty,
            Role = entity.Role ?? string.Empty,
            Role_Ar = entity.Role_Ar ?? string.Empty,
            Company = entity.Company ?? string.Empty,
            Company_Ar = entity.Company_Ar ?? string.Empty,
            Content = entity.Content ?? string.Empty,
            Content_Ar = entity.Content_Ar ?? string.Empty,
            ImagePath = entity.ImagePath ?? string.Empty,
            Phone = entity.Phone ?? string.Empty,
            Email = entity.Email ?? string.Empty,
            SocialLink = entity.SocialLink ?? string.Empty,
            PublishedAt = entity.PublishedAt,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt
        };
    }

    /// <summary>
    /// Updates an existing Reference entity's mutable fields from a ReferenceDto and refreshes its UpdatedAt timestamp.
    /// </summary>
    /// <param name="entity">The target Reference entity to be updated.</param>
    /// <param name="dto">The ReferenceDto providing new values for the entity's fields.</param>
    /// <remarks>Sets UpdatedAt to DateTime.UtcNow. CreatedAt is not modified.</remarks>
    public static void UpdateEntity(Reference entity, ReferenceDto dto)
    {
        entity.Name = dto.Name;
        entity.Name_Ar = dto.Name_Ar;
        entity.Role = dto.Role;
        entity.Role_Ar = dto.Role_Ar;
        entity.Company = dto.Company;
        entity.Company_Ar = dto.Company_Ar;
        entity.Content = dto.Content;
        entity.Content_Ar = dto.Content_Ar;
        entity.ImagePath = dto.ImagePath;
        entity.Phone = dto.Phone;
        entity.Email = dto.Email;
        entity.SocialLink = dto.SocialLink;
        entity.PublishedAt = dto.PublishedAt;
        entity.UpdatedAt = DateTime.UtcNow;
    }
}



