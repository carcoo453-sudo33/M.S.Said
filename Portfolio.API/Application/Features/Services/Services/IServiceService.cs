using Portfolio.API.Application.Features.Services.DTOs;

namespace Portfolio.API.Application.Features.Services.Services;

public interface IServiceService
{
<<<<<<< HEAD
    Task<IEnumerable<ServiceDto>> GetServicesAsync();
    Task<ServiceDto?> GetServiceByIdAsync(Guid id);
    Task<ServiceDto> CreateServiceAsync(ServiceDto dto);
    Task<ServiceDto> UpdateServiceAsync(Guid id, ServiceDto dto);
    Task<bool> DeleteServiceAsync(Guid id);
=======
    /// <summary>
/// Retrieves all service records.
/// </summary>
/// <returns>An enumerable of ServiceDto representing all services; empty if no services are found.</returns>
Task<IEnumerable<ServiceDto>> GetServicesAsync();
    /// <summary>
/// Retrieves a service by its identifier.
/// </summary>
/// <param name="id">The GUID identifier of the service to retrieve.</param>
/// <returns>The matching <see cref="ServiceDto"/> if found; otherwise, <c>null</c>.</returns>
Task<ServiceDto?> GetServiceByIdAsync(Guid id);
    /// <summary>
/// Creates a new service from the provided DTO and persists it.
/// </summary>
/// <param name="dto">Data transfer object containing the properties for the new service.</param>
/// <returns>The created ServiceDto including any assigned identifiers or generated fields.</returns>
Task<ServiceDto> CreateServiceAsync(ServiceDto dto);
    /// <summary>
/// Updates the service identified by <paramref name="id"/> using values from <paramref name="dto"/> and returns the updated service.
/// </summary>
/// <param name="id">The identifier of the service to update.</param>
/// <param name="dto">The DTO containing updated service properties.</param>
/// <returns>The updated <see cref="ServiceDto"/>.</returns>
Task<ServiceDto> UpdateServiceAsync(Guid id, ServiceDto dto);
    /// <summary>
/// Deletes the service identified by the specified id.
/// </summary>
/// <param name="id">The unique identifier of the service to delete.</param>
/// <returns>True if the service was deleted; false otherwise.</returns>
Task<bool> DeleteServiceAsync(Guid id);
>>>>>>> origin/master
}



