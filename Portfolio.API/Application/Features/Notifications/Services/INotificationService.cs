using Portfolio.API.Application.Features.Notifications.DTOs;

namespace Portfolio.API.Application.Features.Notifications.Services;

public interface INotificationService
{
    /// <summary>
        /// Creates a notification with the specified type, title, and message and attaches optional metadata.
        /// </summary>
        /// <param name="type">Notification category or identifier (for example, "info" or "alert").</param>
        /// <param name="title">Short headline for the notification.</param>
        /// <param name="message">Detailed notification content.</param>
        /// <param name="link">Optional URL associated with the notification.</param>
        /// <param name="icon">Optional icon identifier or URL to display with the notification.</param>
        /// <param name="relatedEntityId">Optional identifier of a related domain entity.</param>
        /// <param name="relatedEntityType">Optional type or name of the related domain entity.</param>
        /// <param name="senderName">Optional display name of the notification sender.</param>
        /// <param name="senderEmail">Optional email address of the notification sender.</param>
        Task CreateNotificationAsync(string type, string title, string message, string? link = null, 
        string? icon = null, string? relatedEntityId = null, string? relatedEntityType = null,
        string? senderName = null, string? senderEmail = null);
    
    /// <summary>
/// Retrieves a list of notifications with optional result limiting and unread-only filtering.
/// </summary>
/// <param name="limit">Maximum number of notifications to return; defaults to 50.</param>
/// <param name="unreadOnly">If true, only unread notifications are included; if false, both read and unread notifications are included.</param>
/// <returns>A list of NotificationDto objects matching the specified limit and filter.</returns>
Task<List<NotificationDto>> GetNotificationsAsync(int limit = 50, bool unreadOnly = false);
    
    /// <summary>
/// Retrieves aggregated notification statistics.
/// </summary>
/// <returns>A <see cref="NotificationStatsDto"/> containing summary metrics such as total notifications and unread count.</returns>
Task<NotificationStatsDto> GetStatsAsync();
    
    /// <summary>
/// Marks the notification with the specified identifier as read.
/// </summary>
/// <param name="id">The identifier of the notification to mark as read.</param>
Task MarkAsReadAsync(string id);
    
    /// <summary>
/// Marks all notifications as read.
/// </summary>
Task MarkAllAsReadAsync();
    
    /// <summary>
/// Deletes the notification with the specified identifier.
/// </summary>
/// <param name="id">The identifier of the notification to delete.</param>
Task DeleteNotificationAsync(string id);
    
    /// <summary>
/// Removes all notifications.
/// </summary>
Task ClearAllAsync();
}



