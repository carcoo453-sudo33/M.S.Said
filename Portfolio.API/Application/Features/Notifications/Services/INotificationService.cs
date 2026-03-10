using Portfolio.API.Application.Features.Notifications.DTOs;

namespace Portfolio.API.Application.Features.Notifications.Services;

public interface INotificationService
{
    Task<IEnumerable<NotificationDto>> GetNotificationsAsync(int limit = 50, bool unreadOnly = false);
    Task<NotificationStatsDto> GetStatsAsync();
    Task MarkAsReadAsync(string id);
    Task MarkAllAsReadAsync();
    Task DeleteNotificationAsync(string id);
    Task ClearAllAsync();
    Task CreateNotificationAsync(string type, string title, string message, string? link, string? icon, 
        string? relatedEntityId, string? relatedEntityType, string? senderName, string? senderEmail);
}
