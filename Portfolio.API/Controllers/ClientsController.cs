using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.API.Entities;
using Portfolio.API.Repositories;
using Portfolio.API.DTOs;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClientsController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public ClientsController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Client>>> GetClients()
    {
        var clients = await _unitOfWork.Repository<Client>().GetAllAsync();
        return Ok(clients.OrderBy(c => c.Order));
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<Client>> CreateClient(ClientDto dto)
    {
        var entry = new Client
        {
            Id = dto.Id != Guid.Empty ? dto.Id : Guid.NewGuid(),
            Name = dto.Name,
            LogoUrl = dto.LogoUrl,
            Order = dto.Order
        };
        await _unitOfWork.Repository<Client>().AddAsync(entry);
        await _unitOfWork.CompleteAsync();
        return CreatedAtAction(nameof(GetClients), new { id = entry.Id }, entry);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateClient(Guid id, ClientDto dto)
    {
        var repository = _unitOfWork.Repository<Client>();
        var client = await repository.GetByIdAsync(id);
        
        if (client == null) return NotFound();

        client.Name = dto.Name;
        client.LogoUrl = dto.LogoUrl;
        client.Order = dto.Order;
        client.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.CompleteAsync();
        return Ok(client);
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteClient(Guid id)
    {
        var entry = await _unitOfWork.Repository<Client>().GetByIdAsync(id);
        if (entry == null) return NotFound();
        _unitOfWork.Repository<Client>().Delete(entry);
        await _unitOfWork.CompleteAsync();
        return NoContent();
    }
}
