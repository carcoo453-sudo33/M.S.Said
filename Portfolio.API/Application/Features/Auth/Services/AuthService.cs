using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Portfolio.API.Application.Features.Auth.DTOs;
using Portfolio.API.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Portfolio.API.Application.Features.Auth.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly IConfigurationService _configService;

    public AuthService(UserManager<IdentityUser> userManager, IConfigurationService configService)
    {
        _userManager = userManager;
        _configService = configService;
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return new LoginResponse
            {
                Success = false,
                Message = "Email and password are required"
            };
        }

        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            return new LoginResponse
            {
                Success = false,
                Message = "Invalid email or password"
            };
        }

        var passwordValid = await _userManager.CheckPasswordAsync(user, request.Password);
        if (!passwordValid)
        {
            return new LoginResponse
            {
                Success = false,
                Message = "Invalid email or password"
            };
        }

        var token = GenerateJwtToken(user);

        return new LoginResponse
        {
            Success = true,
            Message = "Login successful",
            Token = token,
            Email = user.Email,
            UserId = user.Id
        };
    }

    private string GenerateJwtToken(IdentityUser user)
    {
        var key = Encoding.UTF8.GetBytes(_configService.GetJwtSecretKey());
        var tokenHandler = new JwtSecurityTokenHandler();

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email ?? string.Empty),
            new Claim(ClaimTypes.Name, user.UserName ?? string.Empty)
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(_configService.GetJwtExpiryMinutes()),
            Issuer = _configService.GetJwtIssuer(),
            Audience = _configService.GetJwtAudience(),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}
