using System.Text.RegularExpressions;

namespace Portfolio.API.ValueObjects;

public class Url
{
    private static readonly Regex UrlRegex = new Regex(
        @"^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$",
        RegexOptions.Compiled | RegexOptions.IgnoreCase);

    public string Value { get; }

    private Url(string value)
    {
        if (!IsValid(value))
            throw new ArgumentException("Invalid URL", nameof(value));

        Value = value;
    }

    public static Url Create(string url)
    {
        return new Url(url);
    }

    public static bool IsValid(string url)
    {
        if (string.IsNullOrWhiteSpace(url))
            return false;

        // Add https:// if not present for validation
        if (!url.StartsWith("http://") && !url.StartsWith("https://"))
            url = "https://" + url;

        return Uri.TryCreate(url, UriKind.Absolute, out var uriResult) 
            && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
    }

    public override string ToString() => Value;

    public static implicit operator string(Url url) => url.Value;

    public override bool Equals(object? obj)
    {
        if (obj is Url other)
            return Value == other.Value;
        return false;
    }

    public override int GetHashCode() => Value.GetHashCode();

    public static bool operator ==(Url left, Url right)
    {
        if (ReferenceEquals(left, right)) return true;
        if (left is null || right is null) return false;
        return left.Equals(right);
    }

    public static bool operator !=(Url left, Url right) => !(left == right);
}