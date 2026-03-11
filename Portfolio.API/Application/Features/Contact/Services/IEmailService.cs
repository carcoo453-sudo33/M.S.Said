namespace Portfolio.API.Application.Features.Contact.Services;

public interface IEmailService
{
    /// <summary>
/// Sends a contact email using the provided sender details and message.
/// </summary>
/// <param name="senderName">Display name of the sender.</param>
/// <param name="senderEmail">Email address of the sender.</param>
/// <param name="subject">Subject line for the email.</param>
/// <param name="message">Body content of the email.</param>
/// <param name="cancellationToken">Token to cancel the send operation.</param>
Task SendContactEmailAsync(string senderName, string senderEmail, string subject, string message, CancellationToken cancellationToken = default);
}


