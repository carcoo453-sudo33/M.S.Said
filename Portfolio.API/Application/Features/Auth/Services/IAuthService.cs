using Portfolio.API.Application.Features.Auth.DTOs;

namespace Portfolio.API.Application.Features.Auth.Services;

public interface IAuthService
{
    /// <summary>
/// Authenticates a user using the provided login request and produces the corresponding login response.
/// </summary>
/// <param name="request">Credentials and related data required to authenticate a user.</param>
/// <returns>A <see cref="LoginResponse"/> containing authentication tokens and user information.</returns>
Task<LoginResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default);
}