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

<<<<<<< HEAD
=======
    /// <summary>
    /// Initializes a new instance of <see cref="AuthService"/> with its required dependencies.
    /// </summary>
    /// <param name="userManager">The ASP.NET Identity user manager used to find and validate users.</param>
    /// <param name="configService">Service that provides JWT configuration values (secret, expiry, issuer, audience).</param>
>>>>>>> origin/master
    public AuthService(UserManager<IdentityUser> userManager, IConfigurationService configService)
    {
        _userManager = userManager;
        _configService = configService;
    }

<<<<<<< HEAD
=======
    /// <summary>
    /// Authenticates a user using the provided email and password and returns a login result containing a JWT on success.
    /// </summary>
    /// <param name="request">LoginRequest containing the user's Email and Password.</param>
    /// <param name="cancellationToken">Token to cancel the operation.</param>
    /// <returns>
    /// A LoginResponse: on success, Success = true with Token (JWT), Email, and UserId; on failure, Success = false with an error Message.
    /// </returns>
>>>>>>> origin/master
    public async Task<LoginResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default)
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

<<<<<<< HEAD
=======
    /// <summary>
    /// Generate a signed JSON Web Token containing the user's identifier, email, and username.
    /// </summary>
    /// <param name="user">The user whose Id, Email, and UserName are included as claims (Email/UserName are treated as empty strings if null).</param>
    /// <returns>The serialized signed JWT containing claims for the user's id, email, and username.</returns>
>>>>>>> origin/master
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
