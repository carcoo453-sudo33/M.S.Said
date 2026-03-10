using System.Net;
using System.Net.Mail;
using Portfolio.API.Application.Features.Contact.Templates;

namespace Portfolio.API.Application.Features.Contact.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task SendContactEmailAsync(string senderName, string senderEmail, string subject, string message, CancellationToken cancellationToken = default)
    {
        try
        {
            var smtpSettings = _configuration.GetSection("EmailSettings");
            var smtpHost = smtpSettings["SmtpHost"];
            var smtpPort = int.Parse(smtpSettings["SmtpPort"] ?? "587");
            var smtpUsername = smtpSettings["SmtpUsername"];
            var smtpPassword = smtpSettings["SmtpPassword"];
            var fromEmail = smtpSettings["FromEmail"];
            var toEmail = smtpSettings["ToEmail"];
            if (string.IsNullOrEmpty(toEmail))
            {
                _logger.LogWarning("ToEmail not configured. Skipping email send.");
                return;
            }

            var enableSsl = bool.Parse(smtpSettings["EnableSsl"] ?? "true");

            // If SMTP is not configured, log and return
            if (string.IsNullOrEmpty(smtpHost) || string.IsNullOrEmpty(smtpUsername))
            {
                _logger.LogWarning("Email settings not configured. Skipping email send.");
                return;
            }

            using var client = new SmtpClient(smtpHost, smtpPort)
            {
                Credentials = new NetworkCredential(smtpUsername, smtpPassword),
                EnableSsl = enableSsl
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(fromEmail ?? smtpUsername, "Portfolio Contact Form"),
                To = { toEmail },
                Subject = $"New Contact Message: {subject}",
                Body = ContactEmailTemplate.GetContactEmailHtml(senderName, senderEmail, subject, message),
                IsBodyHtml = true
            };

            await client.SendMailAsync(mailMessage);
            _logger.LogInformation("Contact email sent successfully to {ToEmail} from {SenderEmail}", toEmail, senderEmail);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Failed to send contact email: {ex.Message}");
            // Don't throw - email failure shouldn't break the contact form
        }
    }
}



