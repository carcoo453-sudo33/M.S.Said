using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.API.Application.Features.Services.DTOs;
using Portfolio.API.Application.Features.Services.Services;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ServicesController : ControllerBase
{
    private readonly IServiceService _serviceService;

    public ServicesController(IServiceService serviceService)
    {
        _serviceService = serviceService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ServiceDto>>> GetServices()
    {
        var services = await _serviceService.GetServicesAsync();
        return Ok(services);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ServiceDto>> GetServiceById(Guid id)
    {
        var service = await _serviceService.GetServiceByIdAsync(id);
        if (service == null) return NotFound();
        return Ok(service);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ServiceDto>> CreateService(ServiceDto dto)
    {
        var result = await _serviceService.CreateServiceAsync(dto);
        return CreatedAtAction(nameof(GetServiceById), new { id = result.Id }, result);
    }

    [Authorize]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateService(Guid id, ServiceDto dto)
    {
        var result = await _serviceService.UpdateServiceAsync(id, dto);
        return Ok(result);
    }

    [Authorize]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteService(Guid id)
    {
        await _serviceService.DeleteServiceAsync(id);
        return NoContent();
    }
}
