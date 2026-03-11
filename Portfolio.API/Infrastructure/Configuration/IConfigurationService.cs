namespace Portfolio.API.Services;

public interface IConfigurationService
{
    string GetConnectionString();
    string GetJwtSecretKey();
    string GetJwtIssuer();
    string GetJwtAudience();
    int GetJwtExpiryMinutes();
    string GetSmtpUsername();
    string GetSmtpPassword();
    string GetFromEmail();
    string GetToEmail();
}

public class ConfigurationService : IConfigurationService
{
    private readonly IConfiguration _configuration;

    public ConfigurationService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GetConnectionString()
    {
        return _configuration.GetConnectionString("DefaultConnection") 
               ?? throw new InvalidOperationException("Connection string not configured");
    }

    public string GetJwtSecretKey()
    {
        return _configuration["Jwt:SecretKey"] 
               ?? Environment.GetEnvironmentVariable("JWT_SECRET_KEY")
               ?? throw new InvalidOperationException("JWT Secret Key not configured");
    }

    public string GetJwtIssuer()
    {
        return _configuration["Jwt:Issuer"] 
               ?? Environment.GetEnvironmentVariable("JWT_ISSUER")
               ?? throw new InvalidOperationException("JWT Issuer not configured");
    }

    public string GetJwtAudience()
    {
        return _configuration["Jwt:Audience"] 
               ?? Environment.GetEnvironmentVariable("JWT_AUDIENCE")
               ?? throw new InvalidOperationException("JWT Audience not configured");
    }

    public int GetJwtExpiryMinutes()
    {
        return _configuration.GetValue<int>("Jwt:ExpiryInMinutes", 60);
    }

    public string GetSmtpUsername()
    {
        return _configuration["EmailSettings:SmtpUsername"] 
               ?? Environment.GetEnvironmentVariable("SMTP_USERNAME")
               ?? throw new InvalidOperationException("SMTP Username not configured");
    }

    public string GetSmtpPassword()
    {
        return _configuration["EmailSettings:SmtpPassword"] 
               ?? Environment.GetEnvironmentVariable("SMTP_PASSWORD")
               ?? throw new InvalidOperationException("SMTP Password not configured");
    }

    public string GetFromEmail()
    {
        return _configuration["EmailSettings:FromEmail"] 
               ?? Environment.GetEnvironmentVariable("FROM_EMAIL")
               ?? throw new InvalidOperationException("From Email not configured");
    }

    public string GetToEmail()
    {
        return _configuration["EmailSettings:ToEmail"] 
               ?? Environment.GetEnvironmentVariable("TO_EMAIL")
               ?? throw new InvalidOperationException("To Email not configured");
    }
}