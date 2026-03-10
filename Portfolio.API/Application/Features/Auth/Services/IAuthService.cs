using Portfolio.API.Application.Features.Auth.DTOs;

namespace Portfolio.API.Application.Features.Auth.Services;

public interface IAuthService
{
    Task<LoginResponse> LoginAsync(LoginRequest request);
}
