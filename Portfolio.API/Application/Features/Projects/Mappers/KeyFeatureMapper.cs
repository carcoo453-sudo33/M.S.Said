using Portfolio.API.Application.Features.Projects.DTOs;
using Portfolio.API.Entities;
using Portfolio.API.Constants;

namespace Portfolio.API.Application.Features.Projects.Mappers;

public static class KeyFeatureMapper
{
    public static KeyFeatureDto ToResponse(KeyFeature entity)
    {
        return new KeyFeatureDto
        {
            Id = entity.Id,
            Title = entity.Title ?? string.Empty,
            Title_Ar = entity.Title_Ar ?? string.Empty,
            Link = entity.Link ?? string.Empty,
            Date = entity.Date ?? string.Empty,
            FeatureType = entity.FeatureType
        };
    }

    /// <summary>
    /// Creates a new KeyFeature entity populated from a KeyFeatureCreateDto.
    /// </summary>
    /// <param name="request">The DTO containing Title, Title_Ar, Link, Date, and FeatureType to copy into the entity.</param>
    /// <param name="projectId">Optional project identifier to assign to the entity; if null, the entity's ProjectId is set to Guid.Empty.</param>
    /// <returns>A new KeyFeature with a generated Id, UTC CreatedAt and UpdatedAt timestamps, ProjectId as specified, and other properties copied from the request.</returns>
    public static KeyFeature ToEntity(KeyFeatureCreateDto request, Guid? projectId = null)
    {
        if (projectId == null || projectId == Guid.Empty)
            throw new ArgumentException("ProjectId is required to create a KeyFeature", nameof(projectId));

        return new KeyFeature
        {
            Id = Guid.NewGuid(),
            Title = request.Title,
            Title_Ar = request.Title_Ar,
            Link = request.Link,
            Date = request.Date,
            FeatureType = request.FeatureType,
            ProjectId = projectId.Value,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }
}


