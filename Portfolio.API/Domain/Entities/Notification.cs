using System.ComponentModel.DataAnnotations;
using Portfolio.API.Domain.Enums;

namespace Portfolio.API.Entities;

public class Notification : BaseEntity
{
    public NotificationType Type { get; set; } = NotificationType.SystemAlert;
    [MaxLength(250)]
    public string Title { get; set; } = string.Empty;
    
    [MaxLength(2000)]
    public string Message { get; set; } = string.Empty;
    
    [MaxLength(2000)]
    public string? Link { get; set; } // Link to related resource
    
    [MaxLength(100)]
    public string? Icon { get; set; } // Icon name for UI
    
    public bool IsRead { get; set; } = false;
    
    [MaxLength(100)]
    public string? RelatedEntityId { get; set; } // ID of related entity (comment, contact message, etc.)
    
    [MaxLength(100)]
    public string? RelatedEntityType { get; set; } // Type of related entity
    
    [MaxLength(200)]
    public string? SenderName { get; set; } // Name of person who triggered notification
    
    [MaxLength(320)]
    public string? SenderEmail { get; set; }
}

