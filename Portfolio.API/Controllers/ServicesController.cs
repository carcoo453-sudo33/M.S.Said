using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.API.Entities;
using Portfolio.API.Repositories;
using Portfolio.API.DTOs;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ServicesController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public ServicesController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Service>>> GetServices()
    {
        var services = await _unitOfWork.Repository<Service>().GetAllAsync();
        return Ok(services);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<Service>> CreateService(ServiceDto dto)
    {
        var entry = new Service
        {
            Id = dto.Id != Guid.Empty ? dto.Id : Guid.NewGuid(),
            Title = dto.Title,
            Title_Ar = dto.Title_Ar,
            Description = dto.Description,
            Description_Ar = dto.Description_Ar,
            Icon = dto.Icon
        };
        await _unitOfWork.Repository<Service>().AddAsync(entry);
        await _unitOfWork.CompleteAsync();
        return CreatedAtAction(nameof(GetServices), new { id = entry.Id }, entry);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateService(Guid id, ServiceDto dto)
    {
        var repository = _unitOfWork.Repository<Service>();
        var service = await repository.GetByIdAsync(id);
        
        if (service == null) return NotFound();

        service.Title = dto.Title;
        service.Title_Ar = dto.Title_Ar;
        service.Description = dto.Description;
        service.Description_Ar = dto.Description_Ar;
        service.Icon = dto.Icon;
        service.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.CompleteAsync();
        return Ok(service);
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteService(Guid id)
    {
        var service = await _unitOfWork.Repository<Service>().GetByIdAsync(id);
        if (service == null) return NotFound();
        _unitOfWork.Repository<Service>().Delete(service);
        await _unitOfWork.CompleteAsync();
        return NoContent();
    }
}
