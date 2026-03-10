using System.Text.RegularExpressions;

namespace Portfolio.API.Helpers;

public static class ValidationHelper
{
    public static bool IsValidEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            return false;

        var emailRegex = new Regex(@"^[^\s@]+@[^\s@]+\.[^\s@]+$", RegexOptions.IgnoreCase);
        return emailRegex.IsMatch(email);
    }

    public static bool ContainsSpamPatterns(string content)
    {
        if (string.IsNullOrWhiteSpace(content))
            return false;

        var spamPatterns = new[]
        {
            new Regex(@"(.)\1{10,}"), // Repeated characters
            new Regex(@"https?://[^\s]+", RegexOptions.IgnoreCase), // URLs
            new Regex(@"\b(buy|sale|discount|offer|free|win|prize)\b", RegexOptions.IgnoreCase) // Spam keywords
        };

        return spamPatterns.Any(pattern => pattern.IsMatch(content));
    }

    public static bool IsWithinLength(string? text, int maxLength)
    {
        return text?.Length <= maxLength;
    }

    public static bool IsRequired(string? text)
    {
        return !string.IsNullOrWhiteSpace(text);
    }
}