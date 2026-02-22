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
}
