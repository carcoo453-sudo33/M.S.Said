using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Portfolio.API.Application.Features.Notifications.Services;
using Portfolio.API.Data;
using Portfolio.API.Domain.Enums;
using Portfolio.API.Entities;
using Xunit;

namespace Portfolio.API.Tests.Application.Features.Notifications.Services;

public class NotificationServiceTests
{
    private static PortfolioDbContext CreateInMemoryContext(string dbName)
    {
        var options = new DbContextOptionsBuilder<PortfolioDbContext>()
            .UseInMemoryDatabase(databaseName: dbName)
            .Options;
        return new PortfolioDbContext(options);
    }

    private static NotificationService CreateService(PortfolioDbContext context,
        out Mock<IHubContext<NotificationHub>> mockHub,
        out Mock<IClientProxy> mockClientProxy,
        out Mock<ILogger<NotificationService>> mockLogger)
    {
        mockHub = new Mock<IHubContext<NotificationHub>>();
        var mockClients = new Mock<IHubClients>();
        mockClientProxy = new Mock<IClientProxy>();

        mockClients.Setup(c => c.All).Returns(mockClientProxy.Object);
        mockHub.SetupGet(h => h.Clients).Returns(mockClients.Object);
        mockClientProxy
            .Setup(c => c.SendAsync(
                It.Is<string>(m => m == "ReceiveNotification"),
                It.IsAny<object?>(),
                It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        mockLogger = new Mock<ILogger<NotificationService>>();

        return new NotificationService(context, mockHub.Object, mockLogger.Object);
    }

    [Fact]
    public async Task CreateNotificationAsync_ParsesInvalidTypeAsSystemAlert_UsesDefaultIconAndBroadcasts()
    {
        using var context = CreateInMemoryContext(nameof(CreateNotificationAsync_ParsesInvalidTypeAsSystemAlert_UsesDefaultIconAndBroadcasts));
        var service = CreateService(context, out var mockHub, out var mockClientProxy, out var _);

        await service.CreateNotificationAsync("InvalidType", "Title", "Message");

        var saved = await context.Notifications.AsNoTracking().SingleAsync();
        Assert.Equal(NotificationType.SystemAlert, saved.Type);
        Assert.Equal("bell", saved.Icon);

        mockClientProxy.Verify(c => c.SendAsync(
            It.Is<string>(m => m == "ReceiveNotification"),
            It.IsAny<object?>(),
            It.IsAny<CancellationToken>()), Times.Once);
    }

    private class ThrowingDbContext : PortfolioDbContext
    {
        public ThrowingDbContext(DbContextOptions<PortfolioDbContext> options) : base(options) { }
        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
            => throw new Exception("Simulated failure");
    }

    [Fact]
    public async Task CreateNotificationAsync_OnSaveThrows_LogsErrorAndDoesNotThrow()
    {
        var options = new DbContextOptionsBuilder<PortfolioDbContext>()
            .UseInMemoryDatabase(databaseName: nameof(CreateNotificationAsync_OnSaveThrows_LogsErrorAndDoesNotThrow))
            .Options;
        await using var context = new ThrowingDbContext(options);

        var service = CreateService(context, out var _, out var _, out var mockLogger);

        var ex = await Record.ExceptionAsync(() => service.CreateNotificationAsync("Comment", "t", "m"));
        Assert.Null(ex); // should not throw

        // Verify an error was logged
        mockLogger.Verify(
            x => x.Log(
                It.Is<LogLevel>(l => l == LogLevel.Error),
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("Failed to create notification")),
                It.IsAny<Exception>(),
                It.Is<Func<It.IsAnyType, Exception?, string>>((v, t) => true)),
            Times.AtLeastOnce);
    }

    [Fact]
    public async Task GetNotificationsAsync_UnreadOnly_ReturnsOnlyUnread_InDescendingOrder()
    {
        using var context = CreateInMemoryContext(nameof(GetNotificationsAsync_UnreadOnly_ReturnsOnlyUnread_InDescendingOrder));
        context.Notifications.AddRange(
            new Notification { Id = Guid.NewGuid(), Title = "n1", Message = "m1", IsRead = true, CreatedAt = DateTime.UtcNow.AddMinutes(-10) },
            new Notification { Id = Guid.NewGuid(), Title = "n2", Message = "m2", IsRead = false, CreatedAt = DateTime.UtcNow.AddMinutes(-5) },
            new Notification { Id = Guid.NewGuid(), Title = "n3", Message = "m3", IsRead = false, CreatedAt = DateTime.UtcNow.AddMinutes(-1) }
        );
        await context.SaveChangesAsync();

        var service = CreateService(context, out var _, out var _, out var _);

        var result = await service.GetNotificationsAsync(limit: 10, unreadOnly: true);

        Assert.All(result, r => Assert.False(r.IsRead));
        Assert.Equal(new[] { "n3", "n2" }, result.Select(r => r.Title).ToArray());
    }

    [Fact]
    public async Task GetStatsAsync_ReturnsCorrectTotals()
    {
        using var context = CreateInMemoryContext(nameof(GetStatsAsync_ReturnsCorrectTotals));
        context.Notifications.AddRange(
            new Notification { Id = Guid.NewGuid(), Title = "n1", IsRead = false },
            new Notification { Id = Guid.NewGuid(), Title = "n2", IsRead = true },
            new Notification { Id = Guid.NewGuid(), Title = "n3", IsRead = false }
        );
        await context.SaveChangesAsync();

        var service = CreateService(context, out var _, out var _, out var _);

        var stats = await service.GetStatsAsync();
        Assert.Equal(3, stats.TotalCount);
        Assert.Equal(2, stats.UnreadCount);
    }

    [Fact]
    public async Task MarkAsReadAsync_ValidId_MarksNotificationAsRead()
    {
        using var context = CreateInMemoryContext(nameof(MarkAsReadAsync_ValidId_MarksNotificationAsRead));
        var id = Guid.NewGuid();
        context.Notifications.Add(new Notification { Id = id, Title = "n", IsRead = false });
        await context.SaveChangesAsync();

        var service = CreateService(context, out var _, out var _, out var _);
        await service.MarkAsReadAsync(id.ToString());

        var entity = await context.Notifications.FindAsync(id);
        Assert.NotNull(entity);
        Assert.True(entity!.IsRead);
    }

    [Fact]
    public async Task MarkAsReadAsync_InvalidGuid_NoOp()
    {
        using var context = CreateInMemoryContext(nameof(MarkAsReadAsync_InvalidGuid_NoOp));
        context.Notifications.Add(new Notification { Id = Guid.NewGuid(), Title = "n", IsRead = false });
        await context.SaveChangesAsync();
        var before = await context.Notifications.AsNoTracking().CountAsync(n => n.IsRead);

        var service = CreateService(context, out var _, out var _, out var _);
        await service.MarkAsReadAsync("not-a-guid");

        var after = await context.Notifications.AsNoTracking().CountAsync(n => n.IsRead);
        Assert.Equal(before, after);
    }

    [Fact]
    public async Task DeleteNotificationAsync_ValidId_DeletesNotification()
    {
        using var context = CreateInMemoryContext(nameof(DeleteNotificationAsync_ValidId_DeletesNotification));
        var id = Guid.NewGuid();
        context.Notifications.Add(new Notification { Id = id, Title = "n" });
        await context.SaveChangesAsync();

        var service = CreateService(context, out var _, out var _, out var _);
        await service.DeleteNotificationAsync(id.ToString());

        var exists = await context.Notifications.AsNoTracking().AnyAsync(n => n.Id == id);
        Assert.False(exists);
    }

    [Fact]
    public async Task DeleteNotificationAsync_InvalidGuid_NoOp()
    {
        using var context = CreateInMemoryContext(nameof(DeleteNotificationAsync_InvalidGuid_NoOp));
        context.Notifications.Add(new Notification { Id = Guid.NewGuid(), Title = "n" });
        await context.SaveChangesAsync();
        var before = await context.Notifications.AsNoTracking().CountAsync();

        var service = CreateService(context, out var _, out var _, out var _);
        await service.DeleteNotificationAsync("not-a-guid");

        var after = await context.Notifications.AsNoTracking().CountAsync();
        Assert.Equal(before, after);
    }
}
