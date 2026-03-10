using Portfolio.API.Features.Projects.DTOs;
using Portfolio.API.Entities;
using Portfolio.API.Constants;

namespace Portfolio.API.Features.Projects.Mappers;

public static class KeyFeatureMapper
{
    public static KeyFeatureDto ToResponse(KeyFeature entity)
    {
        return new KeyFeatureDto
        {
            Id = entity.Id,
            Title = entity.Title,
            Title_Ar = entity.Title_Ar,
            Link = entity.Link,
            Date = entity.Date,
            FeatureType = entity.FeatureType
        };
    }

    public static KeyFeature ToEntity(KeyFeatureCreateDto request, Guid? projectId = null)
    {
        return new KeyFeature
        {
            Id = Guid.NewGuid(),
            Title = request.Title,
            Title_Ar = request.Title_Ar,
            Link = request.Link,
            Date = request.Date,
            FeatureType = request.FeatureType,
            ProjectId = projectId ?? Guid.Empty,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }
}