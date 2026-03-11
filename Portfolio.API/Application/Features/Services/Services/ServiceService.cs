using Portfolio.API.Entities;
using Portfolio.API.Repositories;
using Portfolio.API.Application.Features.Services.DTOs;
using Portfolio.API.Application.Features.Services.Mappers;

namespace Portfolio.API.Application.Features.Services.Services;

public class ServiceService : IServiceService
{
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of ServiceService with the specified unit of work.
    /// </summary>
    /// <param name="unitOfWork">Unit-of-work used for repository access and transaction control.</param>
    public ServiceService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Retrieve all service entities and return them as DTOs.
    /// </summary>
    /// <returns>A collection of ServiceDto objects representing all services.</returns>
    public async Task<IEnumerable<ServiceDto>> GetServicesAsync()
    {
        var services = await _unitOfWork.Repository<Service>().GetAllAsync();
        return services.Select(ServiceMapper.ToDto);
    }

    /// <summary>
    /// Retrieve a service by its identifier and map it to a DTO.
    /// </summary>
    /// <param name="id">The identifier of the service to retrieve.</param>
    /// <returns>`ServiceDto` for the matching service, or `null` if no service exists with the specified id.</returns>
    public async Task<ServiceDto?> GetServiceByIdAsync(Guid id)
    {
        var service = await _unitOfWork.Repository<Service>().GetByIdAsync(id);
        return service == null ? null : ServiceMapper.ToDto(service);
    }

    /// <summary>
    /// Creates a new Service from the provided DTO, persists it, and returns the created service as a DTO.
    /// </summary>
    /// <param name="dto">Service data used to create the entity. If <see cref="Guid"/> in <c>dto.Id</c> is empty, a new identifier is generated.</param>
    /// <returns>The created Service mapped to a <see cref="ServiceDto"/>.</returns>
    public async Task<ServiceDto> CreateServiceAsync(ServiceDto dto)
    {
        var service = new Service
        {
            Id = dto.Id != Guid.Empty ? dto.Id : Guid.NewGuid(),
            Title = dto.Title,
            Title_Ar = dto.Title_Ar,
            Description = dto.Description,
            Description_Ar = dto.Description_Ar,
            IconPath = dto.IconPath,
            Order = dto.Order
        };
        await _unitOfWork.Repository<Service>().AddAsync(service);
        await _unitOfWork.CompleteAsync();
        return ServiceMapper.ToDto(service);
    }

    /// <summary>
    /// Updates the Service identified by the specified id with values from the provided DTO.
    /// </summary>
    /// <param name="id">The identifier of the Service to update.</param>
    /// <param name="dto">The DTO containing updated Service values.</param>
    /// <returns>The updated Service represented as a ServiceDto.</returns>
    /// <exception cref="KeyNotFoundException">Thrown when no Service with the specified id exists.</exception>
    public async Task<ServiceDto> UpdateServiceAsync(Guid id, ServiceDto dto)
    {
        var service = await _unitOfWork.Repository<Service>().GetByIdAsync(id);
        if (service == null)
            throw new KeyNotFoundException($"Service with id {id} not found");

        ServiceMapper.UpdateEntity(service, dto);
        await _unitOfWork.CompleteAsync();
        return ServiceMapper.ToDto(service);
    }

    /// <summary>
    /// Deletes the service with the specified identifier.
    /// </summary>
    /// <param name="id">The identifier of the service to delete.</param>
    /// <returns>`true` if a service was found and deleted, `false` otherwise.</returns>
    public async Task<bool> DeleteServiceAsync(Guid id)
    {
        var service = await _unitOfWork.Repository<Service>().GetByIdAsync(id);
        if (service == null)
            return false;

        _unitOfWork.Repository<Service>().Delete(service);
        await _unitOfWork.CompleteAsync();
        return true;
    }
}



