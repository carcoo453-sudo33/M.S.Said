# Email Configuration Guide

## Overview
The contact form now sends emails to your Gmail account (`m.ssaid356@gmail.com`) and creates in-app notifications when someone submits a message.

## Setup Instructions

### 1. Enable Gmail App Password

Since Gmail requires app-specific passwords for SMTP access:

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification** (enable if not already)
3. Scroll down to **App passwords**
4. Select **Mail** and **Windows Computer** (or Other)
5. Click **Generate**
6. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### 2. Update appsettings.json

Open `Portfolio.API/appsettings.json` and update the EmailSettings section:

```json
"EmailSettings": {
  "SmtpHost": "smtp.gmail.com",
  "SmtpPort": "587",
  "SmtpUsername": "m.ssaid356@gmail.com",
  "SmtpPassword": "your-16-char-app-password-here",
  "FromEmail": "m.ssaid356@gmail.com",
  "ToEmail": "m.ssaid356@gmail.com",
  "EnableSsl": "true"
}
```

### 3. For Production (appsettings.Production.json)

For security, use environment variables or Azure Key Vault in production:

```json
"EmailSettings": {
  "SmtpHost": "smtp.gmail.com",
  "SmtpPort": "587",
  "SmtpUsername": "m.ssaid356@gmail.com",
  "SmtpPassword": "${EMAIL_PASSWORD}",
  "FromEmail": "m.ssaid356@gmail.com",
  "ToEmail": "m.ssaid356@gmail.com",
  "EnableSsl": "true"
}
```

Then set the environment variable:
```bash
export EMAIL_PASSWORD="your-app-password"
```

## How It Works

When someone submits the contact form:

1. **Message is saved** to the database
2. **Email is sent** to `m.ssaid356@gmail.com` with:
   - Sender's name and email
   - Subject and message
   - Reply-to set to sender's email (you can reply directly)
3. **In-app notification** is created and sent via SignalR to your admin panel

## Testing

1. Fill out the contact form on your website
2. Check your Gmail inbox for the notification email
3. Check the notification bell icon in your admin panel
4. The notification will show the sender's name and subject

## Troubleshooting

### Email not sending?
- Check that 2-Step Verification is enabled on your Google account
- Verify the app password is correct (no spaces)
- Check the API logs for error messages
- Ensure port 587 is not blocked by your firewall

### Still not working?
- Try using port 465 with SSL instead of 587 with TLS
- Check Gmail's "Less secure app access" settings (though app passwords should work)
- Verify your Gmail account isn't blocking SMTP access

## Alternative Email Providers

If you prefer to use a different email service:

### SendGrid
```json
"SmtpHost": "smtp.sendgrid.net",
"SmtpPort": "587",
"SmtpUsername": "apikey",
"SmtpPassword": "your-sendgrid-api-key"
```

### Outlook/Office 365
```json
"SmtpHost": "smtp.office365.com",
"SmtpPort": "587",
"SmtpUsername": "your-email@outlook.com",
"SmtpPassword": "your-password"
```

## Security Notes

- Never commit `appsettings.json` with real passwords to Git
- Use `appsettings.Development.json` for local testing
- Use environment variables or Azure Key Vault for production
- The email service gracefully fails if not configured (won't break the contact form)
