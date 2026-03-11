using System.Net;
using System.Net.Mail;

namespace Portfolio.API.Services;

public interface IEmailService
{
    Task SendContactEmailAsync(string senderName, string senderEmail, string subject, string message);
}

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task SendContactEmailAsync(string senderName, string senderEmail, string subject, string message)
    {
        try
        {
            var smtpSettings = _configuration.GetSection("EmailSettings");
            var smtpHost = smtpSettings["SmtpHost"];
            var smtpPort = int.Parse(smtpSettings["SmtpPort"] ?? "587");
            var smtpUsername = smtpSettings["SmtpUsername"];
            var smtpPassword = smtpSettings["SmtpPassword"];
            var fromEmail = smtpSettings["FromEmail"];
            var toEmail = smtpSettings["ToEmail"] ?? "m.ssaid356@gmail.com";
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
                Subject = $"New Contact Message: {subject}",
                Body = $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
</head>
<body style='margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, ""Helvetica Neue"", Arial, sans-serif; background-color: #f5f5f5;'>
    <table width='100%' cellpadding='0' cellspacing='0' style='max-width: 600px; margin: 0 auto; background-color: #ffffff;'>
        <tr>
            <td style='padding: 0;'>
                <!-- Header -->
                <table width='100%' cellpadding='0' cellspacing='0'>
                    <tr>
                        <td style='background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 30px; text-align: center;'>
                            <h1 style='margin: 0; color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;'>
                                NEW CONTACT MESSAGE
                            </h1>
                            <p style='margin: 10px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 12px; text-transform: uppercase; letter-spacing: 2px;'>
                                Portfolio Contact Form
                            </p>
                        </td>
                    </tr>
                </table>

                <!-- Content -->
                <table width='100%' cellpadding='0' cellspacing='0'>
                    <tr>
                        <td style='padding: 40px 30px;'>
                            <!-- Sender Info -->
                            <table width='100%' cellpadding='0' cellspacing='0' style='margin-bottom: 30px;'>
                                <tr>
                                    <td style='padding: 20px; background-color: #fafafa; border-left: 4px solid #dc2626; border-radius: 8px;'>
                                        <table width='100%' cellpadding='0' cellspacing='0'>
                                            <tr>
                                                <td style='padding-bottom: 12px;'>
                                                    <span style='display: inline-block; font-size: 10px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 1px;'>From</span>
                                                    <p style='margin: 5px 0 0 0; font-size: 18px; font-weight: 700; color: #111827;'>{senderName}</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style='padding-bottom: 12px;'>
                                                    <span style='display: inline-block; font-size: 10px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 1px;'>Email</span>
                                                    <p style='margin: 5px 0 0 0; font-size: 16px; color: #dc2626;'>
                                                        <a href='mailto:{senderEmail}' style='color: #dc2626; text-decoration: none; font-weight: 600;'>{senderEmail}</a>
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span style='display: inline-block; font-size: 10px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 1px;'>Subject</span>
                                                    <p style='margin: 5px 0 0 0; font-size: 16px; font-weight: 600; color: #111827;'>{subject}</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Message -->
                            <table width='100%' cellpadding='0' cellspacing='0'>
                                <tr>
                                    <td style='padding: 0 0 10px 0;'>
                                        <h2 style='margin: 0; font-size: 14px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 1px;'>MESSAGE</h2>
                                    </td>
                                </tr>
                                <tr>
                                    <td style='padding: 20px; background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;'>
                                        <p style='margin: 0; font-size: 15px; line-height: 1.6; color: #374151; white-space: pre-wrap;'>{message}</p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Action Button -->
                            <table width='100%' cellpadding='0' cellspacing='0' style='margin-top: 30px;'>
                                <tr>
                                    <td style='text-align: center; padding: 20px 0;'>
                                        <a href='mailto:{senderEmail}' style='display: inline-block; padding: 14px 32px; background-color: #dc2626; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; border-radius: 8px; box-shadow: 0 4px 6px rgba(220, 38, 38, 0.2);'>
                                            REPLY TO {senderName}
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>

                <!-- Footer -->
                <table width='100%' cellpadding='0' cellspacing='0'>
                    <tr>
                        <td style='padding: 30px; background-color: #18181b; text-align: center; border-top: 4px solid #dc2626;'>
                            <p style='margin: 0 0 10px 0; font-size: 12px; color: #a1a1aa; line-height: 1.5;'>
                                This message was sent from your portfolio contact form.
                            </p>
                            <p style='margin: 0; font-size: 11px; color: #71717a;'>
                                © 2024 Mostafa Samir Said. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>",
                IsBodyHtml = true
            };

            mailMessage.To.Add(toEmail);
            mailMessage.ReplyToList.Add(new MailAddress(senderEmail, senderName));

            await client.SendMailAsync(mailMessage);
            _logger.LogInformation($"Contact email sent successfully to {toEmail} from {senderEmail}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Failed to send contact email: {ex.Message}");
            // Don't throw - email failure shouldn't break the contact form
        }
    }
}
