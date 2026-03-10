using Portfolio.API.Application.Features.Services.DTOs;

namespace Portfolio.API.Application.Features.Services.Services;

public interface IServiceService
{
    Task<IEnumerable<ServiceDto>> GetServicesAsync();
    Task<ServiceDto?> GetServiceByIdAsync(Guid id);
    Task<ServiceDto> CreateServiceAsync(ServiceDto dto);
    Task<ServiceDto> UpdateServiceAsync(Guid id, ServiceDto dto);
    Task<bool> DeleteServiceAsync(Guid id);
}



