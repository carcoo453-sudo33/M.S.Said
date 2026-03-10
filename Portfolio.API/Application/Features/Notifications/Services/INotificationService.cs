using Portfolio.API.Application.Features.Notifications.DTOs;

namespace Portfolio.API.Application.Features.Notifications.Services;

public interface INotificationService
{
    Task CreateNotificationAsync(string type, string title, string message, string? link = null, 
        string? icon = null, string? relatedEntityId = null, string? relatedEntityType = null,
        string? senderName = null, string? senderEmail = null);
    
    Task<List<NotificationDto>> GetNotificationsAsync(int limit = 50, bool unreadOnly = false);
    
    Task<NotificationStatsDto> GetStatsAsync();
    
    Task MarkAsReadAsync(string id);
    
    Task MarkAllAsReadAsync();
    
    Task DeleteNotificationAsync(string id);
    
    Task ClearAllAsync();
}



