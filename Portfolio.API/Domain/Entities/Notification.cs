using Portfolio.API.Domain.Enums;

namespace Portfolio.API.Entities;

public class Notification : BaseEntity
{
    public NotificationType Type { get; set; } = NotificationType.SystemAlert;
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string? Link { get; set; } // Link to related resource
    public string? Icon { get; set; } // Icon name for UI
    public bool IsRead { get; set; } = false;
    public string? RelatedEntityId { get; set; } // ID of related entity (comment, contact message, etc.)
    public string? RelatedEntityType { get; set; } // Type of related entity
    public string? SenderName { get; set; } // Name of person who triggered notification
    public string? SenderEmail { get; set; }
}

