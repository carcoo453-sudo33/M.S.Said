namespace Portfolio.API.Application.Features.Contact.Templates;

/// <summary>
/// Email template for contact form submissions
/// Uses Tailwind theme colors for consistent styling
/// </summary>
public static class ContactEmailTemplate
{
    /// <summary>
    /// Generates the HTML email template for contact form submissions
    /// Maps Tailwind theme colors to email-safe hex values
<<<<<<< HEAD
    /// </summary>
=======
    /// <summary>
    /// Generates an HTML document for a contact form submission email using the provided sender details and message.
    /// </summary>
    /// <param name="senderName">The name of the person who submitted the contact form.</param>
    /// <param name="senderEmail">The sender's email address (used for display and mailto links).</param>
    /// <param name="subject">The subject provided in the contact form.</param>
    /// <param name="message">The message body provided in the contact form; preserved with whitespace.</param>
    /// <returns>An HTML string representing a complete email (inline styles and color constants applied) for the given contact information.</returns>
>>>>>>> origin/master
    public static string GetContactEmailHtml(string senderName, string senderEmail, string subject, string message)
    {
        // Tailwind theme color mappings (from variables.css)
        const string primaryColor = "#dc2626";           // red-600 (primary)
        const string primaryDark = "#991b1b";            // red-900 (darker primary for gradient)
        const string primaryForeground = "#fafafa";      // zinc-50
        const string mutedBackground = "#fafafa";        // zinc-100
        const string mutedText = "#6b7280";              // zinc-500
        const string foregroundText = "#111827";         // zinc-950
        const string cardBackground = "#ffffff";         // white
        const string borderColor = "#e5e7eb";            // zinc-200
        const string lightBackground = "#f9fafb";        // zinc-50
        const string footerBackground = "#18181b";       // zinc-950
        const string footerText = "#a1a1aa";             // zinc-400
        const string footerSubtext = "#71717a";          // zinc-500

        return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
</head>
<body style='margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, ""Helvetica Neue"", Arial, sans-serif; background-color: #f5f5f5;'>
    <table width='100%' cellpadding='0' cellspacing='0' style='max-width: 600px; margin: 0 auto; background-color: {cardBackground};'>
        <tr>
            <td style='padding: 0;'>
                <!-- Header -->
                <table width='100%' cellpadding='0' cellspacing='0'>
                    <tr>
                        <td style='background: linear-gradient(135deg, {primaryColor} 0%, {primaryDark} 100%); padding: 30px; text-align: center;'>
                            <h1 style='margin: 0; color: {primaryForeground}; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;'>
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
                                    <td style='padding: 20px; background-color: {mutedBackground}; border-left: 4px solid {primaryColor}; border-radius: 8px;'>
                                        <table width='100%' cellpadding='0' cellspacing='0'>
                                            <tr>
                                                <td style='padding-bottom: 12px;'>
                                                    <span style='display: inline-block; font-size: 10px; font-weight: 700; color: {mutedText}; text-transform: uppercase; letter-spacing: 1px;'>From</span>
                                                    <p style='margin: 5px 0 0 0; font-size: 18px; font-weight: 700; color: {foregroundText};'>{senderName}</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style='padding-bottom: 12px;'>
                                                    <span style='display: inline-block; font-size: 10px; font-weight: 700; color: {mutedText}; text-transform: uppercase; letter-spacing: 1px;'>Email</span>
                                                    <p style='margin: 5px 0 0 0; font-size: 16px; color: {primaryColor};'>
                                                        <a href='mailto:{senderEmail}' style='color: {primaryColor}; text-decoration: none; font-weight: 600;'>{senderEmail}</a>
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span style='display: inline-block; font-size: 10px; font-weight: 700; color: {mutedText}; text-transform: uppercase; letter-spacing: 1px;'>Subject</span>
                                                    <p style='margin: 5px 0 0 0; font-size: 16px; font-weight: 600; color: {foregroundText};'>{subject}</p>
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
                                        <h2 style='margin: 0; font-size: 14px; font-weight: 700; color: {mutedText}; text-transform: uppercase; letter-spacing: 1px;'>MESSAGE</h2>
                                    </td>
                                </tr>
                                <tr>
                                    <td style='padding: 20px; background-color: {lightBackground}; border-radius: 8px; border: 1px solid {borderColor};'>
                                        <p style='margin: 0; font-size: 15px; line-height: 1.6; color: #374151; white-space: pre-wrap;'>{message}</p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Action Button -->
                            <table width='100%' cellpadding='0' cellspacing='0' style='margin-top: 30px;'>
                                <tr>
                                    <td style='text-align: center; padding: 20px 0;'>
                                        <a href='mailto:{senderEmail}' style='display: inline-block; padding: 14px 32px; background-color: {primaryColor}; color: {primaryForeground}; text-decoration: none; font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; border-radius: 8px; box-shadow: 0 4px 6px rgba(220, 38, 38, 0.2);'>
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
                        <td style='padding: 30px; background-color: {footerBackground}; text-align: center; border-top: 4px solid {primaryColor};'>
                            <p style='margin: 0 0 10px 0; font-size: 12px; color: {footerText}; line-height: 1.5;'>
                                This message was sent from your portfolio contact form.
                            </p>
                            <p style='margin: 0; font-size: 11px; color: {footerSubtext};'>
                                © 2024 Mostafa Samir Said. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>";
    }
}



