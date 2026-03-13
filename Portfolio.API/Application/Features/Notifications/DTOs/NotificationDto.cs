namespace Portfolio.API.Application.Features.Notifications.DTOs;

public class NotificationDto
{
    public string Id { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string? Link { get; set; } = string.Empty;
    public string? Icon { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? RelatedEntityId { get; set; } = string.Empty;
    public string? RelatedEntityType { get; set; } = string.Empty;
    public string? SenderName { get; set; } = string.Empty;
    public string? SenderEmail { get; set; } = string.Empty;
}



