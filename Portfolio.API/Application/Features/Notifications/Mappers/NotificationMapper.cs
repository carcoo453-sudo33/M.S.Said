using Portfolio.API.Entities;
using Portfolio.API.Application.Features.Notifications.DTOs;

namespace Portfolio.API.Application.Features.Notifications.Mappers;

public class NotificationMapper
{
    public static NotificationDto ToDto(Notification entity)
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



