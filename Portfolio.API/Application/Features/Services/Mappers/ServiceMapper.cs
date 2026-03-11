using Portfolio.API.Entities;
using Portfolio.API.Application.Features.Services.DTOs;

namespace Portfolio.API.Application.Features.Services.Mappers;

public class ServiceMapper
{
    /// <summary>
    /// Creates a ServiceDto populated from the given Service entity.
    /// </summary>
    /// <param name="entity">The Service entity to convert to a DTO.</param>
    /// <returns>A ServiceDto with properties copied from the provided entity.</returns>
    public static ServiceDto ToDto(Service entity)
    {
        return new ServiceDto
        {
            Id = entity.Id,
            Title = entity.Title,
            Title_Ar = entity.Title_Ar,
            Description = entity.Description,
            Description_Ar = entity.Description_Ar,
            IconPath = entity.IconPath,
            Order = entity.Order,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt
        };
    }

    /// <summary>
    /// Update a Service entity's editable fields from a ServiceDto and set UpdatedAt to the current UTC time.
    /// </summary>
    /// <param name="entity">The Service entity to update.</param>
    /// <param name="dto">The ServiceDto that provides new values for the entity's properties.</param>
    public static void UpdateEntity(Service entity, ServiceDto dto)
    {
        entity.Title = dto.Title;
        entity.Title_Ar = dto.Title_Ar;
        entity.Description = dto.Description;
        entity.Description_Ar = dto.Description_Ar;
        entity.IconPath = dto.IconPath;
        entity.Order = dto.Order;
        entity.UpdatedAt = DateTime.UtcNow;
    }
}



