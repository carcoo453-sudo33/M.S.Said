using Microsoft.AspNetCore.Mvc;
using Portfolio.API.Application.Features.Contact.DTOs;
using Portfolio.API.Application.Features.Contact.Services;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
    private readonly IContactService _contactService;

    public ContactController(IContactService contactService)
    {
        _contactService = contactService;
    }

    [HttpGet]
    public async Task<IActionResult> GetMessages()
    {
        var messages = await _contactService.GetMessagesAsync();
        return Ok(messages);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetMessageById(Guid id)
    {
        var message = await _contactService.GetMessageByIdAsync(id);
        if (message == null) return NotFound();
        return Ok(message);
    }

    [HttpPost]
    public async Task<IActionResult> PostMessage(ContactDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var result = await _contactService.CreateMessageAsync(dto);
        return Ok(new { message = "Message received successfully.", data = result });
    }

    [HttpPatch("{id:guid}/read")]
    public async Task<IActionResult> MarkAsRead(Guid id, CancellationToken cancellationToken = default)
    {
        try
        {
            await _contactService.MarkAsReadAsync(id, cancellationToken);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteMessage(Guid id, CancellationToken cancellationToken = default)
    {
        try
        {
            await _contactService.DeleteMessageAsync(id, cancellationToken);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }
}