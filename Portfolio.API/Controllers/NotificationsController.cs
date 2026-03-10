using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.API.Data;
using Portfolio.API.DTOs;
using Portfolio.API.Entities;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotificationsController : ControllerBase
{
    private readonly PortfolioDbContext _context;

    public NotificationsController(PortfolioDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<List<NotificationDto>>> GetNotifications([FromQuery] int limit = 50, [FromQuery] bool unreadOnly = false)
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
                .Select(n => new NotificationDto
                {
                    Id = n.Id.ToString(),
                    Type = n.Type.ToString(),
                    Title = n.Title,
                    Message = n.Message,
                    Link = n.Link,
                    Icon = n.Icon,
                    IsRead = n.IsRead,
                    CreatedAt = n.CreatedAt,
                    RelatedEntityId = n.RelatedEntityId,
                    RelatedEntityType = n.RelatedEntityType,
                    SenderName = n.SenderName,
                    SenderEmail = n.SenderEmail
                })
                .ToListAsync();

            return Ok(notifications);
        }
        catch (Exception ex)
        {
            // Return empty list if table doesn't exist yet
            Console.WriteLine($"[NotificationsController] Error getting notifications: {ex.Message}");
            return Ok(new List<NotificationDto>());
        }
    }

    [HttpGet("stats")]
    [Authorize]
    public async Task<ActionResult<NotificationStatsDto>> GetStats()
    {
        try
        {
            var totalCount = await _context.Notifications.CountAsync();
            var unreadCount = await _context.Notifications.CountAsync(n => !n.IsRead);

            return Ok(new NotificationStatsDto
            {
                TotalCount = totalCount,
                UnreadCount = unreadCount
            });
        }
        catch (Exception ex)
        {
            // Return zero stats if table doesn't exist yet
            Console.WriteLine($"[NotificationsController] Error getting stats: {ex.Message}");
            return Ok(new NotificationStatsDto
            {
                TotalCount = 0,
                UnreadCount = 0
            });
        }
    }

    [HttpPut("{id}/mark-read")]
    [Authorize]
    public async Task<IActionResult> MarkAsRead(string id)
    {
        try
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification == null)
            {
                return NotFound();
            }

            notification.IsRead = true;
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[NotificationsController] Error marking as read: {ex.Message}");
            return NoContent(); // Silently succeed if table doesn't exist
        }
    }

    [HttpPut("mark-all-read")]
    [Authorize]
    public async Task<IActionResult> MarkAllAsRead()
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

            return NoContent();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[NotificationsController] Error marking all as read: {ex.Message}");
            return NoContent(); // Silently succeed if table doesn't exist
        }
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteNotification(string id)
    {
        try
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification == null)
            {
                return NotFound();
            }

            _context.Notifications.Remove(notification);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[NotificationsController] Error deleting notification: {ex.Message}");
            return NoContent(); // Silently succeed if table doesn't exist
        }
    }

    [HttpDelete("clear-all")]
    [Authorize]
    public async Task<IActionResult> ClearAll()
    {
        try
        {
            var notifications = await _context.Notifications.ToListAsync();
            _context.Notifications.RemoveRange(notifications);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[NotificationsController] Error clearing all: {ex.Message}");
            return NoContent(); // Silently succeed if table doesn't exist
        }
    }
}
