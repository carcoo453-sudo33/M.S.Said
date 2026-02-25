using Microsoft.AspNetCore.Mvc;
using Portfolio.API.Entities;
using Portfolio.API.Repositories;
using Portfolio.API.DTOs;
using Portfolio.API.Services;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly INotificationService _notificationService;
    private readonly IEmailService _emailService;

    public ContactController(IUnitOfWork unitOfWork, INotificationService notificationService, IEmailService emailService)
    {
        _unitOfWork = unitOfWork;
        _notificationService = notificationService;
        _emailService = emailService;
    }

    // GET api/contact — list all messages (newest first) for admin panel
    [HttpGet]
    public async Task<IActionResult> GetMessages()
    {
        var messages = await _unitOfWork.Repository<ContactMessage>().GetAllAsync();
        var ordered = messages.OrderByDescending(m => m.SentAt);
        return Ok(ordered);
    }

    // GET api/contact/{id} — get a single message by ID
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetMessageById(Guid id)
    {
        var message = await _unitOfWork.Repository<ContactMessage>().GetByIdAsync(id);
        if (message is null) return NotFound();
        return Ok(message);
    }

    // POST api/contact — receive a new contact message from the public form
    [HttpPost]
    public async Task<IActionResult> PostMessage(ContactDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var message = new ContactMessage
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Email = dto.Email,
            Subject = dto.Subject,
            Message = dto.Message,
            SentAt = DateTime.UtcNow,
            IsRead = false
        };

        await _unitOfWork.Repository<ContactMessage>().AddAsync(message);
        await _unitOfWork.CompleteAsync();

        // Send email notification
        await _emailService.SendContactEmailAsync(dto.Name, dto.Email, dto.Subject, dto.Message);

        // Create in-app notification
        await _notificationService.CreateNotificationAsync(
            type: "ContactForm",
            title: $"New Contact Message from {dto.Name}",
            message: dto.Subject,
            link: null,
            icon: "mail",
            relatedEntityId: message.Id.ToString(),
            relatedEntityType: "ContactMessage",
            senderName: dto.Name,
            senderEmail: dto.Email
        );

        return Ok(new { message = "Message received successfully." });
    }

    // PATCH api/contact/{id}/read — mark a message as read
    [HttpPatch("{id:guid}/read")]
    public async Task<IActionResult> MarkAsRead(Guid id)
    {
        var repository = _unitOfWork.Repository<ContactMessage>();
        var message = await repository.GetByIdAsync(id);
        if (message is null) return NotFound();

        message.IsRead = true;
        message.UpdatedAt = DateTime.UtcNow;
        await _unitOfWork.CompleteAsync();

        return NoContent();
    }
}
