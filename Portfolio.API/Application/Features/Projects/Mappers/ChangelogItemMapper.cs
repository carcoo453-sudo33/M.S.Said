using Portfolio.API.Features.Projects.DTOs;
using Portfolio.API.Entities;

namespace Portfolio.API.Features.Projects.Mappers;

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