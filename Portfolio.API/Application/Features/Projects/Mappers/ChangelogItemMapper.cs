using Portfolio.API.Application.Features.Projects.DTOs;
using Portfolio.API.Entities;

namespace Portfolio.API.Application.Features.Projects.Mappers;

public static class ChangelogItemMapper
{
    public static ChangelogItemDto ToResponse(ChangelogItem entity)
    {
        return new ChangelogItemDto
        {
            Id = entity.Id,
            Date = entity.Date,
            Version = entity.Version,
            Title = entity.Title,
            Title_Ar = entity.Title_Ar,
            Description = entity.Description,
            Description_Ar = entity.Description_Ar
        };
    }

    /// <summary>
    /// Creates a new ChangelogItem entity from the provided create DTO and optional project identifier.
    /// </summary>
    /// <param name="request">DTO containing changelog fields to copy into the entity.</param>
    /// <param name="projectId">Optional project identifier to assign to the entity; uses Guid.Empty when null.</param>
    /// <returns>
    /// A ChangelogItem with a new Id, Date set to request.Date or the current UTC date formatted as "MMM dd, yyyy",
    /// Version defaulting to "1.0.0" when not provided, Title/Description fields copied from the request,
    /// ProjectId set from <paramref name="projectId"/>, and CreatedAt/UpdatedAt set to the current UTC time.
    /// </returns>
    public static ChangelogItem ToEntity(ChangelogItemCreateDto request, Guid? projectId = null)
    {
        return new ChangelogItem
        {
            Id = Guid.NewGuid(),
            Date = request.Date ?? DateTime.UtcNow.ToString("MMM dd, yyyy"),
            Version = request.Version ?? "1.0.0",
            Title = request.Title,
            Title_Ar = request.Title_Ar,
            Description = request.Description,
            Description_Ar = request.Description_Ar,
            ProjectId = projectId ?? Guid.Empty,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }
}


