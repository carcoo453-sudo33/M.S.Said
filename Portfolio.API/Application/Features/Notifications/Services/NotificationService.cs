using Microsoft.EntityFrameworkCore;
using Portfolio.API.Entities;
using Portfolio.API.Enums;
using Portfolio.API.Infrastructure.Data;
using Portfolio.API.Application.Features.Notifications.DTOs;
using Portfolio.API.Application.Features.Notifications.Mappers;

namespace Portfolio.API.Application.Features.Notifications.Services;

public class NotificationService : INotificationService
{
    private readonly PortfolioDbContext _context;

    public NotificationService(PortfolioDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<NotificationDto>> GetNotificationsAsync(int limit = 50, bool unreadOnly = false)
    {
        try
        {
            var query = _context.Notifications.AsQueryable();

            if (unreadOnly)
            {
                query = query.Where(n => !n.IsRead);
            }

            var notifications = await query
                .OrderByDescending(n => n.CreatedAt)
                .Take(limit)
                .ToListAsync();

            return notifications.Select(NotificationMapper.ToDto);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[NotificationService] Error getting notifications: {ex.Message}");
            return new List<NotificationDto>();
        }
    }

    public async Task<NotificationStatsDto> GetStatsAsync()
    {
        try
        {
            var totalCount = await _context.Notifications.CountAsync();
            var unreadCount = await _context.Notifications.CountAsync(n => !n.IsRead);

            return new NotificationStatsDto
            {
                TotalCount = totalCount,
                UnreadCount = unreadCount
            };
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[NotificationService] Error getting stats: {ex.Message}");
            return new NotificationStatsDto { TotalCount = 0, UnreadCount = 0 };
        }
    }

    public async Task MarkAsReadAsync(string id)
    {
        try
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification == null)
                throw new KeyNotFoundException($"Notification with id {id} not found");

            notification.IsRead = true;
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[NotificationService] Error marking as read: {ex.Message}");
        }
    }

    public async Task MarkAllAsReadAsync()
    {
        try
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
        catch (Exception ex)
        {
            Console.WriteLine($"[NotificationService] Error marking all as read: {ex.Message}");
        }
    }

    public async Task DeleteNotificationAsync(string id)
    {
        try
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification == null)
                throw new KeyNotFoundException($"Notification with id {id} not found");

            _context.Notifications.Remove(notification);
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[NotificationService] Error deleting notification: {ex.Message}");
        }
    }

    public async Task ClearAllAsync()
    {
        try
        {
            var notifications = await _context.Notifications.ToListAsync();
            _context.Notifications.RemoveRange(notifications);
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[NotificationService] Error clearing all: {ex.Message}");
        }
    }

    public async Task CreateNotificationAsync(string type, string title, string message, string? link,
        string? icon, string? relatedEntityId, string? relatedEntityType, string? senderName, string? senderEmail)
    {
        try
        {
            var notification = new Notification
            {
                Id = Guid.NewGuid().ToString(),
                Type = Enum.TryParse<NotificationType>(type, true, out var notificationType)
                    ? notificationType
                    : NotificationType.SystemAlert,
                Title = title,
                Message = message,
                Link = link,
                Icon = icon,
                IsRead = false,
                RelatedEntityId = relatedEntityId,
                RelatedEntityType = relatedEntityType,
                SenderName = senderName,
                SenderEmail = senderEmail
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[NotificationService] Error creating notification: {ex.Message}");
        }
    }
}
