using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Portfolio.API.Hubs;

[Authorize]
public class NotificationHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        await base.OnConnectedAsync();
        Console.WriteLine($"Client connected: {Context.ConnectionId}");
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await base.OnDisconnectedAsync(exception);
        Console.WriteLine($"Client disconnected: {Context.ConnectionId}");
    }

    // Method to send notification to all connected clients
    public async Task SendNotificationToAll(string type, string title, string message)
    {
        await Clients.All.SendAsync("ReceiveNotification", new
        {
            type,
            title,
            message,
            createdAt = DateTime.UtcNow
        });
    }
}
