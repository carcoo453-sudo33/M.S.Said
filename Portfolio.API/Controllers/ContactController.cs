using Microsoft.AspNetCore.Mvc;
using Portfolio.API.Data;
using Portfolio.API.Entities;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
    private readonly PortfolioDbContext _context;

    public ContactController(PortfolioDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> PostMessage(ContactMessage message)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        message.Id = Guid.NewGuid();
        message.SentAt = DateTime.UtcNow;
        message.IsRead = false;

        _context.ContactMessages.Add(message);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Message received successfully." });
    }
}
