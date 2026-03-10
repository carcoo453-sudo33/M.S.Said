using Portfolio.API.Entities;
using Portfolio.API.Repositories;
using Portfolio.API.Application.Features.Services.DTOs;
using Portfolio.API.Application.Features.Services.Mappers;

namespace Portfolio.API.Application.Features.Services.Services;

public class ServiceService : IServiceService
{
    private readonly IUnitOfWork _unitOfWork;

    public ServiceService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<ServiceDto>> GetServicesAsync()
    {
        var services = await _unitOfWork.Repository<Service>().GetAllAsync();
        return services.Select(ServiceMapper.ToDto);
    }

    public async Task<ServiceDto?> GetServiceByIdAsync(Guid id)
    {
        var service = await _unitOfWork.Repository<Service>().GetByIdAsync(id);
        return service == null ? null : ServiceMapper.ToDto(service);
    }

    public async Task<ServiceDto> CreateServiceAsync(ServiceDto dto)
    {
        var service = new Service
        {
            Id = dto.Id != Guid.Empty ? dto.Id : Guid.NewGuid(),
            Title = dto.Title,
            Title_Ar = dto.Title_Ar,
            Description = dto.Description,
            Description_Ar = dto.Description_Ar,
            Icon = dto.Icon
        };
        await _unitOfWork.Repository<Service>().AddAsync(service);
        await _unitOfWork.CompleteAsync();
        return ServiceMapper.ToDto(service);
    }

    public async Task<ServiceDto> UpdateServiceAsync(Guid id, ServiceDto dto)
    {
        var service = await _unitOfWork.Repository<Service>().GetByIdAsync(id);
        if (service == null)
            throw new KeyNotFoundException($"Service with id {id} not found");

        ServiceMapper.UpdateEntity(service, dto);
        await _unitOfWork.CompleteAsync();
        return ServiceMapper.ToDto(service);
    }

    public async Task DeleteServiceAsync(Guid id)
    {
        var service = await _unitOfWork.Repository<Service>().GetByIdAsync(id);
        if (service == null)
            throw new KeyNotFoundException($"Service with id {id} not found");

        _unitOfWork.Repository<Service>().Delete(service);
        await _unitOfWork.CompleteAsync();
    }
}



