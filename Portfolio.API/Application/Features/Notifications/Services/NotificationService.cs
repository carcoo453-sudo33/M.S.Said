using Portfolio.API.Data;
using Portfolio.API.Entities;
using Portfolio.API.Hubs;
using Portfolio.API.Domain.Enums;
using Portfolio.API.Application.Features.Notifications.DTOs;
using Portfolio.API.Application.Features.Notifications.Mappers;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace Portfolio.API.Application.Features.Notifications.Services;

public class NotificationService : INotificationService
{
    private readonly PortfolioDbContext _context;
    private readonly IHubContext<NotificationHub> _hubContext;
    private readonly ILogger<NotificationService> _logger;

<<<<<<< HEAD
=======
    /// <summary>
    /// Initializes a new instance of <see cref="NotificationService"/> with required dependencies.
    /// </summary>
>>>>>>> origin/master
    public NotificationService(
        PortfolioDbContext context, 
        IHubContext<NotificationHub> hubContext,
        ILogger<NotificationService> logger)
    {
        _context = context;
        _hubContext = hubContext;
        _logger = logger;
    }

<<<<<<< HEAD
=======
    /// <summary>
    /// Creates a notification record, persists it to the database, and broadcasts the notification to all connected clients.
    /// </summary>
    /// <param name="type">A string representing the notification type; parsed to the NotificationType enum. If parsing fails, a system alert type is used.</param>
    /// <param name="title">The notification title shown to recipients.</param>
    /// <param name="message">The notification message body.</param>
    /// <param name="link">An optional URL or internal link associated with the notification.</param>
    /// <param name="icon">An optional icon name; when null a default icon is chosen based on <paramref name="type"/>.</param>
    /// <param name="relatedEntityId">Optional identifier of a related entity (for linking the notification to a resource).</param>
    /// <param name="relatedEntityType">Optional type name of the related entity.</param>
    /// <param name="senderName">Optional display name of the notification sender.</param>
    /// <param name="senderEmail">Optional email address of the notification sender.</param>
>>>>>>> origin/master
    public async Task CreateNotificationAsync(string type, string title, string message, string? link = null, 
        string? icon = null, string? relatedEntityId = null, string? relatedEntityType = null,
        string? senderName = null, string? senderEmail = null)
    {
        try
        {
            // Parse string to NotificationType enum
            if (!Enum.TryParse<NotificationType>(type, out var notificationType))
            {
                notificationType = NotificationType.SystemAlert;
            }

            var notification = new Notification
            {
                Id = Guid.NewGuid(),
                Type = notificationType,
                Title = title,
                Message = message,
                Link = link,
                Icon = icon ?? GetDefaultIcon(type),
                IsRead = false,
                CreatedAt = DateTime.UtcNow,
                RelatedEntityId = relatedEntityId,
                RelatedEntityType = relatedEntityType,
                SenderName = senderName,
                SenderEmail = senderEmail
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            // Send real-time notification via SignalR
            var notificationDto = NotificationMapper.ToDto(notification);
            await _hubContext.Clients.All.SendAsync("ReceiveNotification", notificationDto);
        }
        catch (Exception ex)
        {
            // Log error but don't throw - notifications are not critical
            _logger.LogError(ex, "Failed to create notification of type {Type}: {Message}", type, ex.Message);
        }
    }

<<<<<<< HEAD
=======
    /// <summary>
    /// Retrieves recent notifications, optionally filtering to only unread items.
    /// </summary>
    /// <param name="limit">Maximum number of notifications to return.</param>
    /// <param name="unreadOnly">If true, only include notifications that have not been read.</param>
    /// <returns>A list of NotificationDto ordered by creation time descending, containing up to <paramref name="limit"/> items; if <paramref name="unreadOnly"/> is true, only unread notifications are included.</returns>
>>>>>>> origin/master
    public async Task<List<NotificationDto>> GetNotificationsAsync(int limit = 50, bool unreadOnly = false)
    {
        var query = _context.Notifications.AsQueryable();
        
        if (unreadOnly)
            query = query.Where(n => !n.IsRead);
        
        var notifications = await query
            .OrderByDescending(n => n.CreatedAt)
            .Take(limit)
            .ToListAsync();
        
        return notifications.Select(NotificationMapper.ToDto).ToList();
    }

<<<<<<< HEAD
=======
    /// <summary>
    /// Retrieves the total number of notifications and the number of unread notifications.
    /// </summary>
    /// <returns>A <see cref="NotificationStatsDto"/> where <c>TotalCount</c> is the total notifications and <c>UnreadCount</c> is the number of notifications with <c>IsRead</c> equal to false.</returns>
>>>>>>> origin/master
    public async Task<NotificationStatsDto> GetStatsAsync()
    {
        var total = await _context.Notifications.CountAsync();
        var unread = await _context.Notifications.CountAsync(n => !n.IsRead);
        
        return new NotificationStatsDto
        {
            TotalCount = total,
            UnreadCount = unread
        };
    }

<<<<<<< HEAD
=======
    /// <summary>
    /// Marks the notification identified by <paramref name="id"/> as read and persists the change to the database.
    /// </summary>
    /// <param name="id">The notification identifier as a GUID string; if the value is not a valid GUID or no matching notification exists, no action is taken.</param>
>>>>>>> origin/master
    public async Task MarkAsReadAsync(string id)
    {
        if (!Guid.TryParse(id, out var notificationId))
            return;
        
        var notification = await _context.Notifications.FindAsync(notificationId);
        if (notification != null)
        {
            notification.IsRead = true;
            await _context.SaveChangesAsync();
        }
    }

<<<<<<< HEAD
=======
    /// <summary>
    /// Marks all notifications that are currently unread as read and saves the changes to the data store.
    /// </summary>
>>>>>>> origin/master
    public async Task MarkAllAsReadAsync()
    {
        var unreadNotifications = await _context.Notifications
            .Where(n => !n.IsRead)
            .ToListAsync();
        
        foreach (var notification in unreadNotifications)
        {
            notification.IsRead = true;
        }
        
        await _context.SaveChangesAsync();
    }

<<<<<<< HEAD
=======
    /// <summary>
    /// Deletes the notification with the specified GUID string from the database if it exists.
    /// </summary>
    /// <param name="id">The notification's GUID as a string; if the value is not a valid GUID no action is taken.</param>
>>>>>>> origin/master
    public async Task DeleteNotificationAsync(string id)
    {
        if (!Guid.TryParse(id, out var notificationId))
            return;
        
        var notification = await _context.Notifications.FindAsync(notificationId);
        if (notification != null)
        {
            _context.Notifications.Remove(notification);
            await _context.SaveChangesAsync();
        }
    }

<<<<<<< HEAD
=======
    /// <summary>
    /// Deletes all notifications from the persistent store.
    /// </summary>
    /// <remarks>
    /// All Notification records are removed and the change is persisted to the database.
    /// </remarks>
>>>>>>> origin/master
    public async Task ClearAllAsync()
    {
        var allNotifications = await _context.Notifications.ToListAsync();
        _context.Notifications.RemoveRange(allNotifications);
        await _context.SaveChangesAsync();
    }

<<<<<<< HEAD
=======
    /// <summary>
    /// Selects the default icon name for a notification based on its type.
    /// </summary>
    /// <param name="type">The notification type identifier (e.g., "Comment", "Reply").</param>
    /// <returns>The icon name corresponding to the given notification type, or "bell" if no specific icon is defined.</returns>
>>>>>>> origin/master
    private string GetDefaultIcon(string type)
    {
        return type switch
        {
            "ContactForm" => "mail",
            "Comment" => "message-circle",
            "Reply" => "corner-down-right",
            "WhatsApp" => "message-square",
            "ProjectView" => "eye",
            "BlogView" => "book-open",
            _ => "bell"
        };
    }
}



