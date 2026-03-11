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

    /// <summary>
    /// Initializes a new instance of ServicesController with the provided service handler.
    /// </summary>
    /// <param name="serviceService">Service layer used to perform CRUD operations for services.</param>
    public ServicesController(IServiceService serviceService)
    {
        _serviceService = serviceService;
    }

    /// <summary>
    /// Retrieves all services.
    /// </summary>
    /// <returns>A collection of ServiceDto objects representing all services.</returns>
    [HttpGet]
    [ResponseCache(Duration = 300, Location = ResponseCacheLocation.Any)] // Cache for 5 minutes
    public async Task<ActionResult<IEnumerable<ServiceDto>>> GetServices()
    {
        var services = await _serviceService.GetServicesAsync();
        return Ok(services);
    }

    /// <summary>
    /// Retrieves a service by its unique identifier.
    /// </summary>
    /// <param name="id">The service's unique identifier (GUID).</param>
    /// <returns>An ActionResult containing the requested <see cref="ServiceDto"/> if found; otherwise a NotFound result.</returns>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ServiceDto>> GetServiceById(Guid id)
    {
        var service = await _serviceService.GetServiceByIdAsync(id);
        if (service == null) return NotFound();
        return Ok(service);
    }

    /// <summary>
    /// Creates a new service from the supplied DTO and returns the created resource.
    /// </summary>
    /// <param name="dto">Data transfer object describing the service to create.</param>
    /// <returns>The created ServiceDto including its assigned Id; response includes a Location header for GetServiceById.</returns>
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ServiceDto>> CreateService(ServiceDto dto)
    {
        var result = await _serviceService.CreateServiceAsync(dto);
        return CreatedAtAction(nameof(GetServiceById), new { id = result.Id }, result);
    }

    /// <summary>
    /// Updates an existing service identified by the given GUID with values from the provided DTO.
    /// </summary>
    /// <param name="id">The GUID of the service to update.</param>
    /// <param name="dto">A DTO containing the updated service fields.</param>
    /// <returns>`200 OK` with the updated ServiceDto if the service was found and updated; `404 NotFound` if no service exists with the specified id.</returns>
    [Authorize]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateService(Guid id, ServiceDto dto)
    {
        var result = await _serviceService.UpdateServiceAsync(id, dto);
        if (result == null) return NotFound();
        return Ok(result);
    }
    /// <summary>
    /// Deletes the service identified by the specified id.
    /// </summary>
    /// <param name="id">The GUID of the service to delete.</param>
    /// <returns>`204 NoContent` if the service was deleted, `404 NotFound` if no service with the specified id exists.</returns>
    [Authorize]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteService(Guid id)
    {
        var deleted = await _serviceService.DeleteServiceAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }
}
