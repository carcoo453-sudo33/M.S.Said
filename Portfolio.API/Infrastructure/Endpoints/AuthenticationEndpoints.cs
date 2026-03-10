using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Portfolio.API.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Portfolio.API.Endpoints;

public static class AuthenticationEndpoints
{
    public static void MapAuthenticationEndpoints(this WebApplication app)
    {
        // Map Identity endpoints with rate limiting
        app.MapGroup("/identity").MapIdentityApi<IdentityUser>().RequireRateLimiting("AuthPolicy");

        // Custom login endpoint with proper JWT
        app.MapPost("/identity/login", async (
            LoginRequest login, 
            UserManager<IdentityUser> userManager, 
            SignInManager<IdentityUser> signInManager, 
            IConfigurationService configService) =>
        {
            var user = await userManager.FindByEmailAsync(login.Email);
            if (user == null)
            {
                return Results.Unauthorized();
            }

            var result = await signInManager.CheckPasswordSignInAsync(user, login.Password, lockoutOnFailure: false);
            
            if (!result.Succeeded)
            {
                return Results.Unauthorized();
            }

            // Generate JWT token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(configService.GetJwtSecretKey());
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim("id", user.Id),
                    new Claim("email", user.Email!)
                }),
                Expires = DateTime.UtcNow.AddMinutes(configService.GetJwtExpiryMinutes()),
                Issuer = configService.GetJwtIssuer(),
                Audience = configService.GetJwtAudience(),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return Results.Ok(new { AccessToken = tokenString, ExpiresAt = tokenDescriptor.Expires });
        }).AllowAnonymous().RequireRateLimiting("AuthPolicy");
    }
}

public record LoginRequest(string Email, string Password);