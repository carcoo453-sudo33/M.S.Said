using System.Net;
using System.Net.Mail;
using Portfolio.API.Application.Features.Contact.Templates;

namespace Portfolio.API.Application.Features.Contact.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;

<<<<<<< HEAD
=======
    /// <summary>
    /// Initializes a new instance of <see cref="EmailService"/> with the application's configuration and a logger.
    /// </summary>
>>>>>>> origin/master
    public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

<<<<<<< HEAD
=======
    /// <summary>
    /// Sends a contact email using SMTP settings from configuration with the provided sender details and message.
    /// </summary>
    /// <param name="senderName">Name of the contact form sender.</param>
    /// <param name="senderEmail">Email address of the contact form sender.</param>
    /// <param name="subject">Subject line to include in the email.</param>
    /// <param name="message">Message body provided by the sender.</param>
    /// <param name="cancellationToken">Token to cancel the send operation.</param>
    /// <remarks>
    /// If required SMTP settings or the recipient address are missing, the method logs a warning and exits without sending.
    /// On failure, the method logs the error and suppresses exceptions so failures do not propagate to callers.
    /// </remarks>
>>>>>>> origin/master
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

            using var mailMessage = new MailMessage
            {
                From = new MailAddress(fromEmail ?? smtpUsername, "Portfolio Contact Form"),
                To = { toEmail },
                Subject = $"New Contact Message: {subject}",
                Body = ContactEmailTemplate.GetContactEmailHtml(senderName, senderEmail, subject, message),
                IsBodyHtml = true
            };
            await client.SendMailAsync(mailMessage, cancellationToken);            
            _logger.LogInformation("Contact email sent successfully to {ToEmail} from {SenderEmail}", toEmail, senderEmail);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Failed to send contact email: {ex.Message}");
            // Don't throw - email failure shouldn't break the contact form
        }
    }
}



