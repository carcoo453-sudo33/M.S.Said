namespace Portfolio.API.DTOs;

public class NotificationDto
{
    public string? Id { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string? Link { get; set; }
    public string? Icon { get; set; }
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? RelatedEntityId { get; set; }
    public string? RelatedEntityType { get; set; }
    public string? SenderName { get; set; }
    public string? SenderEmail { get; set; }
}

public class NotificationStatsDto
{
    public int TotalCount { get; set; }
    public int UnreadCount { get; set; }
}
