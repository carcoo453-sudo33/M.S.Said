using Portfolio.API.Entities;
using Portfolio.API.Application.Features.Notifications.DTOs;

namespace Portfolio.API.Application.Features.Notifications.Mappers;

public static class NotificationMapper
{    /// <summary>
    /// Creates a <see cref="NotificationDto"/> populated from the provided <see cref="Notification"/> entity.
    /// </summary>
    /// <param name="entity">The notification entity to map into a DTO.</param>
    /// <returns>A <see cref="NotificationDto"/> with properties copied from the entity; numeric and enum identifiers are converted to strings where applicable.</returns>
    public static NotificationDto ToDto(Notification entity)
    {
        return new NotificationDto
        {
            Id = entity.Id.ToString(),
            Type = entity.Type.ToString(),
            Title = entity.Title,
            Message = entity.Message,
            Link = entity.Link ?? string.Empty,
            Icon = entity.Icon ?? string.Empty,
            IsRead = entity.IsRead,
            CreatedAt = entity.CreatedAt,
            RelatedEntityId = entity.RelatedEntityId ?? string.Empty,
            RelatedEntityType = entity.RelatedEntityType ?? string.Empty,
            SenderName = entity.SenderName ?? string.Empty,
            SenderEmail = entity.SenderEmail ?? string.Empty
        };
    }
}



