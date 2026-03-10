using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.API.Application.Features.Notifications.DTOs;
using Portfolio.API.Application.Features.Notifications.Services;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotificationsController : ControllerBase
{
    private readonly INotificationService _notificationService;

    public NotificationsController(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<List<NotificationDto>>> GetNotifications([FromQuery] int limit = 50, [FromQuery] bool unreadOnly = false)
    {
        var notifications = await _notificationService.GetNotificationsAsync(limit, unreadOnly);
        return Ok(notifications);
    }

    [HttpGet("stats")]
    [Authorize]
    public async Task<ActionResult<NotificationStatsDto>> GetStats()
    {
        var stats = await _notificationService.GetStatsAsync();
        return Ok(stats);
    }

    [HttpPut("{id}/mark-read")]
    [Authorize]
    public async Task<IActionResult> MarkAsRead(string id)
    {
        await _notificationService.MarkAsReadAsync(id);
        return NoContent();
    }

    [HttpPut("mark-all-read")]
    [Authorize]
    public async Task<IActionResult> MarkAllAsRead()
    {
        await _notificationService.MarkAllAsReadAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteNotification(string id)
    {
        await _notificationService.DeleteNotificationAsync(id);
        return NoContent();
    }

    [HttpDelete("clear-all")]
    [Authorize]
    public async Task<IActionResult> ClearAll()
    {
        await _notificationService.ClearAllAsync();
        return NoContent();
    }
}
