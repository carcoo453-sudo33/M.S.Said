using System.Text.RegularExpressions;

namespace Portfolio.API.ValueObjects;

public class Email
{
    private static readonly Regex EmailRegex = new Regex(
        @"^[^@\s]+@[^@\s]+\.[^@\s]+$",
        RegexOptions.Compiled | RegexOptions.IgnoreCase);

    public string Value { get; }

    private Email(string value)
    {
        if (!IsValid(value))
            throw new ArgumentException("Invalid email address", nameof(value));

        Value = value.ToLowerInvariant();
    }

    public static Email Create(string email)
    {
        return new Email(email);
    }

    public static bool IsValid(string email)
    {
        return !string.IsNullOrWhiteSpace(email) && EmailRegex.IsMatch(email);
    }

    public override string ToString() => Value;

    public static implicit operator string(Email email) => email.Value;

    public override bool Equals(object? obj)
    {
        if (obj is Email other)
            return Value == other.Value;
        return false;
    }

    public override int GetHashCode() => Value.GetHashCode();

    public static bool operator ==(Email left, Email right)
    {
        if (ReferenceEquals(left, right)) return true;
        if (left is null || right is null) return false;
        return left.Equals(right);
    }

    public static bool operator !=(Email left, Email right) => !(left == right);
}