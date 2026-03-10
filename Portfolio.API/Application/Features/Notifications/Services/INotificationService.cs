namespace Portfolio.API.Application.Features.Notifications.Services;

public interface INotificationService
{
    Task CreateNotificationAsync(string type, string title, string message, string? link = null, 
        string? icon = null, string? relatedEntityId = null, string? relatedEntityType = null,
        string? senderName = null, string? senderEmail = null);
}



