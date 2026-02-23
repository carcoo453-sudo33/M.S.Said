using Microsoft.AspNetCore.Mvc;
using Portfolio.API.Entities;
using Portfolio.API.Repositories;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public ContactController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    // GET api/contact — list all messages (newest first) for admin panel
    [HttpGet]
    public async Task<IActionResult> GetMessages()
    {
        var messages = await _unitOfWork.Repository<ContactMessage>().GetAllAsync();
        var ordered = messages.OrderByDescending(m => m.SentAt);
        return Ok(ordered);
    }

    // POST api/contact — receive a new contact message from the public form
    [HttpPost]
    public async Task<IActionResult> PostMessage(ContactMessage message)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        message.Id = Guid.NewGuid();
        message.SentAt = DateTime.UtcNow;
        message.IsRead = false;

        await _unitOfWork.Repository<ContactMessage>().AddAsync(message);
        await _unitOfWork.CompleteAsync();

        return Ok(new { message = "Message received successfully." });
    }

    // PATCH api/contact/{id}/read — mark a message as read
    [HttpPatch("{id:guid}/read")]
    public async Task<IActionResult> MarkAsRead(Guid id)
    {
        var message = await _unitOfWork.Repository<ContactMessage>().GetByIdAsync(id);
        if (message is null) return NotFound();

        message.IsRead = true;
        _unitOfWork.Repository<ContactMessage>().Update(message);
        await _unitOfWork.CompleteAsync();

        return NoContent();
    }
}
