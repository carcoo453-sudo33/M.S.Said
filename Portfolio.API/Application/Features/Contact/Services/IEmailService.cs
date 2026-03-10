namespace Portfolio.API.Application.Features.Contact.Services;

public interface IEmailService
{
    Task SendContactEmailAsync(string senderName, string senderEmail, string subject, string message);
}



