using Microsoft.AspNetCore.Mvc;
using Portfolio.API.Application.Features.Auth.DTOs;
using Portfolio.API.Application.Features.Auth.Services;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

<<<<<<< HEAD
=======
    /// <summary>
    /// Initializes a new instance of the AuthController with the specified authentication service.
    /// </summary>
    /// <param name="authService">Service used to authenticate users and produce login responses.</param>
>>>>>>> origin/master
    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

<<<<<<< HEAD
=======
    /// <summary>
    /// Authenticates a user using the provided credentials and returns the login result.
    /// </summary>
    /// <param name="request">Credentials and any required data for authentication (bound from the request body).</param>
    /// <returns>An ActionResult containing the <see cref="LoginResponse"/>: the login result with HTTP 200 OK when authentication succeeds, or HTTP 401 Unauthorized when it fails.</returns>
>>>>>>> origin/master
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        var result = await _authService.LoginAsync(request);
        
        if (!result.Success)
        {
            return Unauthorized(result);
        }
        
        return Ok(result);
    }
}
