using Portfolio.API.Data;
using Portfolio.API.Entities;
using Portfolio.API.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Portfolio.API.Services;

public interface INotificationService
{
    Task CreateNotificationAsync(string type, string title, string message, string? link = null, 
        string? icon = null, string? relatedEntityId = null, string? relatedEntityType = null,
        string? senderName = null, string? senderEmail = null);
}

public class NotificationService : INotificationService
{
    private readonly PortfolioDbContext _context;
    private readonly IHubContext<NotificationHub> _hubContext;

    public NotificationService(PortfolioDbContext context, IHubContext<NotificationHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    public async Task CreateNotificationAsync(string type, string title, string message, string? link = null, 
        string? icon = null, string? relatedEntityId = null, string? relatedEntityType = null,
        string? senderName = null, string? senderEmail = null)
    {
        try
        {
            var notification = new NotificationEntry
            {
                Id = Guid.NewGuid(),
                Type = type,
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
            await _hubContext.Clients.All.SendAsync("ReceiveNotification", new
            {
                id = notification.Id.ToString(),
                type = notification.Type,
                title = notification.Title,
                message = notification.Message,
                link = notification.Link,
                icon = notification.Icon,
                isRead = notification.IsRead,
                createdAt = notification.CreatedAt,
                relatedEntityId = notification.RelatedEntityId,
                relatedEntityType = notification.RelatedEntityType,
                senderName = notification.SenderName,
                senderEmail = notification.SenderEmail
            });
        }
        catch (Exception ex)
        {
            // Log error but don't throw - notifications are not critical
            Console.WriteLine($"[NotificationService] Failed to create notification: {ex.Message}");
        }
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
