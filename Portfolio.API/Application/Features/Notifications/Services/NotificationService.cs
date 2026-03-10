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

    public NotificationService(
        PortfolioDbContext context, 
        IHubContext<NotificationHub> hubContext,
        ILogger<NotificationService> logger)
    {
        _context = context;
        _hubContext = hubContext;
        _logger = logger;
    }

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

    public async Task ClearAllAsync()
    {
        var allNotifications = await _context.Notifications.ToListAsync();
        _context.Notifications.RemoveRange(allNotifications);
        await _context.SaveChangesAsync();
    }

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



