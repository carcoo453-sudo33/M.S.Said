using Portfolio.API.Entities;
using Portfolio.API.Application.Features.Notifications.DTOs;

namespace Portfolio.API.Application.Features.Notifications.Mappers;

public static class NotificationMapper
<<<<<<< HEAD
{    public static NotificationDto ToDto(Notification entity)
=======
{    /// <summary>
    /// Creates a <see cref="NotificationDto"/> populated from the provided <see cref="Notification"/> entity.
    /// </summary>
    /// <param name="entity">The notification entity to map into a DTO.</param>
    /// <returns>A <see cref="NotificationDto"/> with properties copied from the entity; numeric and enum identifiers are converted to strings where applicable.</returns>
    public static NotificationDto ToDto(Notification entity)
>>>>>>> origin/master
    {
        return new NotificationDto
        {
            Id = entity.Id.ToString(),
            Type = entity.Type.ToString(),
            Title = entity.Title,
            Message = entity.Message,
            Link = entity.Link,
            Icon = entity.Icon,
            IsRead = entity.IsRead,
            CreatedAt = entity.CreatedAt,
            RelatedEntityId = entity.RelatedEntityId,
            RelatedEntityType = entity.RelatedEntityType,
            SenderName = entity.SenderName,
            SenderEmail = entity.SenderEmail
        };
    }
}



