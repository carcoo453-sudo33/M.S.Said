using System.Text;
using System.Text.RegularExpressions;

namespace Portfolio.API.ValueObjects;

public class Slug
{
    private static readonly Regex InvalidChars = new Regex(@"[^a-z0-9\s-]", RegexOptions.Compiled);
    private static readonly Regex MultipleSpaces = new Regex(@"\s+", RegexOptions.Compiled);
    private static readonly Regex MultipleDashes = new Regex(@"-+", RegexOptions.Compiled);

    public string Value { get; }

    private Slug(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("Slug cannot be empty", nameof(value));

        Value = value.ToLowerInvariant();
    }

    public static Slug Create(string text)
    {
        var slug = GenerateSlug(text);
        return new Slug(slug);
    }

    public static string GenerateSlug(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
            return string.Empty;

        // Convert to lowercase
        text = text.ToLowerInvariant();

        // Remove diacritics (accents)
        text = RemoveDiacritics(text);

        // Remove invalid characters
        text = InvalidChars.Replace(text, "");

        // Convert spaces to hyphens
        text = text.Replace(' ', '-');

        // Collapse multiple hyphens
        text = MultipleDashes.Replace(text, "-");

        // Trim hyphens from start and end
        text = text.Trim('-');

        return text;
    }

    private static string RemoveDiacritics(string text)
    {
        var normalizedString = text.Normalize(NormalizationForm.FormD);
        var stringBuilder = new StringBuilder();

        foreach (var c in normalizedString)
        {
            var unicodeCategory = System.Globalization.CharUnicodeInfo.GetUnicodeCategory(c);
            if (unicodeCategory != System.Globalization.UnicodeCategory.NonSpacingMark)
            {
                stringBuilder.Append(c);
            }
        }

        return stringBuilder.ToString().Normalize(NormalizationForm.FormC);
    }

    public override string ToString() => Value;

    public static implicit operator string(Slug slug) => slug.Value;

    public override bool Equals(object? obj)
    {
        if (obj is Slug other)
            return Value == other.Value;
        return false;
    }

    public override int GetHashCode() => Value.GetHashCode();

    public static bool operator ==(Slug left, Slug right)
    {
        if (ReferenceEquals(left, right)) return true;
        if (left is null || right is null) return false;
        return left.Equals(right);
    }

    public static bool operator !=(Slug left, Slug right) => !(left == right);
}