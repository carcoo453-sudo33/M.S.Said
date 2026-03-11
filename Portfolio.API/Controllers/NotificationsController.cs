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

    /// <summary>
    /// Initializes a new instance of NotificationsController with the specified notification service.
    /// </summary>
    /// <param name="notificationService">Service used to retrieve and modify notifications.</param>
    public NotificationsController(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    /// <summary>
    /// Retrieves a list of notifications, optionally filtering to only unread items and limiting the number returned.
    /// </summary>
    /// <param name="limit">Maximum number of notifications to return (defaults to 50).</param>
    /// <param name="unreadOnly">If `true`, include only unread notifications; if `false`, include both read and unread.</param>
    /// <returns>A list of <see cref="NotificationDto"/> representing the requested notifications.</returns>
    [HttpGet]
    [Authorize]
    public async Task<ActionResult<List<NotificationDto>>> GetNotifications([FromQuery] int limit = 50, [FromQuery] bool unreadOnly = false)
    {
        var notifications = await _notificationService.GetNotificationsAsync(limit, unreadOnly);
        return Ok(notifications);
    }

    /// <summary>
    /// Retrieves aggregated notification statistics for the current user.
    /// </summary>
    /// <returns>A NotificationStatsDto containing aggregated notification counts (for example total and unread).</returns>
    [HttpGet("stats")]
    [Authorize]
    public async Task<ActionResult<NotificationStatsDto>> GetStats()
    {
        var stats = await _notificationService.GetStatsAsync();
        return Ok(stats);
    }

    /// <summary>
    /// Marks the notification with the specified identifier as read.
    /// </summary>
    /// <param name="id">The identifier of the notification to mark as read.</param>
    /// <returns>An empty 204 No Content response on success.</returns>
    [HttpPut("{id}/mark-read")]
    [Authorize]
    public async Task<IActionResult> MarkAsRead(string id)
    {
        await _notificationService.MarkAsReadAsync(id);
        return NoContent();
    }

    /// <summary>
    /// Marks all notifications as read for the current user.
    /// </summary>
    /// <returns>An HTTP 204 No Content result indicating the notifications were marked as read.</returns>
    [HttpPut("mark-all-read")]
    [Authorize]
    public async Task<IActionResult> MarkAllAsRead()
    {
        await _notificationService.MarkAllAsReadAsync();
        return NoContent();
    }

    /// <summary>
    /// Deletes the notification with the specified identifier.
    /// </summary>
    /// <param name="id">The identifier of the notification to delete.</param>
    /// <returns>204 No Content if the notification was deleted.</returns>
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteNotification(string id)
    {
        await _notificationService.DeleteNotificationAsync(id);
        return NoContent();
    }

    /// <summary>
    /// Removes all notifications for the current user.
    /// </summary>
    /// <returns>HTTP 204 No Content response.</returns>
    [HttpDelete("clear-all")]
    [Authorize]
    public async Task<IActionResult> ClearAll()
    {
        await _notificationService.ClearAllAsync();
        return NoContent();
    }
}
