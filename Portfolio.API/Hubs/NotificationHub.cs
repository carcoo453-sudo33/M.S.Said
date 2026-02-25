using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Portfolio.API.Hubs;

public class NotificationHub : Hub
{
    private static readonly HashSet<string> AdminConnections = new();

    public override async Task OnConnectedAsync()
    {
        await base.OnConnectedAsync();
        var connectionId = Context.ConnectionId;
        var isAuthenticated = Context.User?.Identity?.IsAuthenticated ?? false;
        var userName = Context.User?.Identity?.Name ?? "Anonymous";
        
        Console.WriteLine($"🔌 Client connected: {connectionId}");
        Console.WriteLine($"   - Authenticated: {isAuthenticated}");
        Console.WriteLine($"   - User: {userName}");
        Console.WriteLine($"   - Has User: {Context.User != null}");
        Console.WriteLine($"   - Has Identity: {Context.User?.Identity != null}");
        
        // Check if user is authenticated (admin)
        if (isAuthenticated)
        {
            // Add to admin connections
            AdminConnections.Add(connectionId);
            
            // Broadcast admin online status to all clients
            await Clients.All.SendAsync("AdminStatusChanged", new { isOnline = true });
            Console.WriteLine($"✅ Admin connected. Total admin connections: {AdminConnections.Count}");
        }
        else
        {
            Console.WriteLine($"👤 Visitor connected (not authenticated)");
        }
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await base.OnDisconnectedAsync(exception);
        Console.WriteLine($"🔌 Client disconnected: {Context.ConnectionId}");
        
        // Remove from admin connections if it was an admin
        if (AdminConnections.Remove(Context.ConnectionId))
        {
            // Broadcast admin offline status if no more admin connections
            if (AdminConnections.Count == 0)
            {
                await Clients.All.SendAsync("AdminStatusChanged", new { isOnline = false });
                Console.WriteLine("❌ All admins disconnected. Broadcasting offline status.");
            }
            else
            {
                Console.WriteLine($"⚠️ Admin disconnected. Remaining admin connections: {AdminConnections.Count}");
            }
        }
    }

    // Method to send notification to all connected clients (requires authorization)
    [Authorize]
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
    
    // Method to check if admin is online (public - no authorization required)
    public async Task CheckAdminStatus()
    {
        var isOnline = AdminConnections.Count > 0;
        Console.WriteLine($"📊 CheckAdminStatus called. Admin online: {isOnline}, Connections: {AdminConnections.Count}");
        await Clients.Caller.SendAsync("AdminStatusChanged", new { isOnline });
    }
}
