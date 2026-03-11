using Microsoft.AspNetCore.Mvc;
using Portfolio.API.Application.Features.Contact.DTOs;
using Portfolio.API.Application.Features.Contact.Services;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
    private readonly IContactService _contactService;

<<<<<<< HEAD
=======
    /// <summary>
    /// Initializes a new instance of <see cref="ContactController"/> with the provided contact service.
    /// </summary>
    /// <param name="contactService">Service that handles contact-related operations used by the controller.</param>
>>>>>>> origin/master
    public ContactController(IContactService contactService)
    {
        _contactService = contactService;
    }

<<<<<<< HEAD
=======
    /// <summary>
    /// Retrieves a paginated list of contact messages.
    /// </summary>
    /// <param name="page">The 1-based page number to retrieve.</param>
    /// <param name="pageSize">The number of messages per page.</param>
    /// <param name="cancellationToken">Token to cancel the request.</param>
    /// <returns>An <see cref="IActionResult"/> containing the requested page of contact messages.</returns>
>>>>>>> origin/master
    [HttpGet]
    public async Task<IActionResult> GetMessages([FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken cancellationToken = default)
    {
        var messages = await _contactService.GetMessagesAsync(page, pageSize, cancellationToken);
        return Ok(messages);
    }

<<<<<<< HEAD
=======
    /// <summary>
    /// Retrieves a contact message by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the contact message to retrieve.</param>
    /// <returns>200 OK with the contact message when found, 404 Not Found if no message exists with the given id.</returns>
>>>>>>> origin/master
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetMessageById(Guid id, CancellationToken cancellationToken = default)
    {
        var message = await _contactService.GetMessageByIdAsync(id, cancellationToken);
        if (message == null) return NotFound();
        return Ok(message);
    }

<<<<<<< HEAD
=======
    /// <summary>
    /// Creates a new contact message from the provided DTO and returns the created record.
    /// </summary>
    /// <param name="dto">Contact DTO containing sender information and message content used to create the message.</param>
    /// <returns>`200 OK` with an object containing a confirmation message and the created message data; `400 BadRequest` with model validation details if the DTO is invalid.</returns>
>>>>>>> origin/master
    [HttpPost]
    public async Task<IActionResult> PostMessage(ContactDto dto, CancellationToken cancellationToken = default)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var result = await _contactService.CreateMessageAsync(dto, cancellationToken);
        return Ok(new { message = "Message received successfully.", data = result });
    }

<<<<<<< HEAD
=======
    /// <summary>
    /// Marks the contact message with the specified id as read.
    /// </summary>
    /// <returns>`204 NoContent` if the message was marked as read; `404 NotFound` if no message with the specified id exists.</returns>
>>>>>>> origin/master
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
    }

<<<<<<< HEAD
=======
    /// <summary>
    /// Deletes the contact message identified by the specified GUID.
    /// </summary>
    /// <param name="id">The GUID of the message to delete.</param>
    /// <param name="cancellationToken">Token to cancel the operation.</param>
    /// <returns>HTTP 204 No Content if the message was deleted, HTTP 404 Not Found if no message exists with the given id.</returns>
>>>>>>> origin/master
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