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

    /// <summary>
    /// Initializes a new instance of <see cref="NotificationService"/> with required dependencies.
    /// </summary>
    public NotificationService(
        PortfolioDbContext context, 
        IHubContext<NotificationHub> hubContext,
        ILogger<NotificationService> logger)
    {
        _context = context;
        _hubContext = hubContext;
        _logger = logger;
    }

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
    /// <param name="cancellationToken">Token to cancel the operation.</param>
    public async Task CreateNotificationAsync(string type, string title, string message, string? link = null, 
        string? icon = null, string? relatedEntityId = null, string? relatedEntityType = null,
        string? senderName = null, string? senderEmail = null, CancellationToken cancellationToken = default)
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
            await _context.SaveChangesAsync(cancellationToken);

            // Send real-time notification via SignalR
            var notificationDto = NotificationMapper.ToDto(notification);
            await _hubContext.Clients.All.SendAsync("ReceiveNotification", notificationDto, cancellationToken);
        }
        catch (Exception ex)
        {
            // Log error but don't throw - notifications are not critical
            _logger.LogError(ex, "Failed to create notification of type {Type}: {Message}", type, ex.Message);
        }
    }

    /// <summary>
    /// Retrieves recent notifications, optionally filtering to only unread items.
    /// </summary>
    /// <param name="limit">Maximum number of notifications to return.</param>
    /// <param name="unreadOnly">If true, only include notifications that have not been read.</param>
    /// <param name="cancellationToken">Token to cancel the operation.</param>
    /// <returns>A list of NotificationDto ordered by creation time descending, containing up to <paramref name="limit"/> items; if <paramref name="unreadOnly"/> is true, only unread notifications are included.</returns>
    public async Task<List<NotificationDto>> GetNotificationsAsync(int limit = 50, bool unreadOnly = false, CancellationToken cancellationToken = default)
    {
        var query = _context.Notifications.AsNoTracking().AsQueryable();
        
        if (unreadOnly)
            query = query.Where(n => !n.IsRead);
        
        var notifications = await query
            .OrderByDescending(n => n.CreatedAt)
            .Take(limit)
            .ToListAsync(cancellationToken);
        
        return notifications.Select(NotificationMapper.ToDto).ToList();
    }

    /// <summary>
    /// Retrieves the total number of notifications and the number of unread notifications.
    /// </summary>
    /// <param name="cancellationToken">Token to cancel the operation.</param>
    /// <returns>A <see cref="NotificationStatsDto"/> where <c>TotalCount</c> is the total notifications and <c>UnreadCount</c> is the number of notifications with <c>IsRead</c> equal to false.</returns>
    public async Task<NotificationStatsDto> GetStatsAsync(CancellationToken cancellationToken = default)
    {
        var stats = await _context.Notifications
            .GroupBy(n => 1)
            .Select(g => new
            {
                Total = g.Count(),
                Unread = g.Count(n => !n.IsRead)
            })
            .FirstOrDefaultAsync(cancellationToken);

        return new NotificationStatsDto
        {
            TotalCount = stats?.Total ?? 0,
            UnreadCount = stats?.Unread ?? 0
        };
    }

    /// <summary>
    /// Marks the notification identified by <paramref name="id"/> as read and persists the change to the database.
    /// </summary>
    /// <param name="id">The notification identifier as a GUID string; if the value is not a valid GUID or no matching notification exists, no action is taken.</param>
    /// <param name="cancellationToken">Token to cancel the operation.</param>
    public async Task MarkAsReadAsync(string id, CancellationToken cancellationToken = default)
    {
        if (!Guid.TryParse(id, out var notificationId))
            return;
        
        var notification = await _context.Notifications.FindAsync(new object[] { notificationId }, cancellationToken: cancellationToken);
        if (notification != null)
        {
            notification.IsRead = true;
            await _context.SaveChangesAsync(cancellationToken);
        }
    }

    /// <summary>
    /// Marks all notifications that are currently unread as read and saves the changes to the data store.
    /// </summary>
    /// <param name="cancellationToken">Token to cancel the operation.</param>
    public async Task MarkAllAsReadAsync(CancellationToken cancellationToken = default)
    {
        await _context.Notifications
            .Where(n => !n.IsRead)
            .ExecuteUpdateAsync(setters => setters.SetProperty(n => n.IsRead, true), cancellationToken);
    }

    /// <summary>
    /// Deletes the notification with the specified GUID string from the database if it exists.
    /// </summary>
    /// <param name="id">The notification's GUID as a string; if the value is not a valid GUID no action is taken.</param>
    /// <param name="cancellationToken">Token to cancel the operation.</param>
    public async Task DeleteNotificationAsync(string id, CancellationToken cancellationToken = default)
    {
        if (!Guid.TryParse(id, out var notificationId))
            return;
        
        var notification = await _context.Notifications.FindAsync(new object[] { notificationId }, cancellationToken: cancellationToken);
        if (notification != null)
        {
            _context.Notifications.Remove(notification);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }

    /// <summary>
    /// Deletes all notifications from the persistent store.
    /// </summary>
    /// <param name="cancellationToken">Token to cancel the operation.</param>
    /// <remarks>
    /// All Notification records are removed and the change is persisted to the database.
    /// </remarks>
    public async Task ClearAllAsync(CancellationToken cancellationToken = default)
    {
        await _context.Notifications.ExecuteDeleteAsync(cancellationToken);
    }

    /// <summary>
    /// Selects the default icon name for a notification based on its type.
    /// </summary>
    /// <param name="type">The notification type identifier (e.g., "Comment", "Reply").</param>
    /// <returns>The icon name corresponding to the given notification type, or "bell" if no specific icon is defined.</returns>
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



