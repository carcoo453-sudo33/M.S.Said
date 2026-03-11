using Portfolio.API.Entities;
using Portfolio.API.Repositories;
using Portfolio.API.Application.Features.Contact.DTOs;
using Portfolio.API.Application.Features.Contact.Mappers;
using Portfolio.API.Application.Features.Notifications.Services;

namespace Portfolio.API.Application.Features.Contact.Services;

public class ContactService : IContactService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly INotificationService _notificationService;
    private readonly IEmailService _emailService;

<<<<<<< HEAD
=======
    /// <summary>
    /// Initializes a new instance of <see cref="ContactService"/> with its required dependencies.
    /// </summary>
>>>>>>> origin/master
    public ContactService(IUnitOfWork unitOfWork, INotificationService notificationService, IEmailService emailService)
    {
        _unitOfWork = unitOfWork;
        _notificationService = notificationService;
        _emailService = emailService;
    }

<<<<<<< HEAD
=======
    /// <summary>
    /// Retrieves a paginated list of contact messages ordered from newest to oldest.
    /// </summary>
    /// <param name="page">1-based page number to return.</param>
    /// <param name="pageSize">Number of items per page.</param>
    /// <param name="cancellationToken">Token to cancel the operation.</param>
    /// <returns>A sequence of ContactDto for the requested page ordered by SentAt descending.</returns>
>>>>>>> origin/master
    public async Task<IEnumerable<ContactDto>> GetMessagesAsync(int page = 1, int pageSize = 20, CancellationToken cancellationToken = default)
    {
        var messages = await _unitOfWork.Repository<ContactMessage>().GetAllAsync();
        return messages.OrderByDescending(m => m.SentAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(ContactMapper.ToDto);
    }

<<<<<<< HEAD
=======
    /// <summary>
    /// Retrieves a contact message by its identifier and maps it to a ContactDto.
    /// </summary>
    /// <returns>The message mapped to a ContactDto, or null if no message exists with the specified id.</returns>
>>>>>>> origin/master
    public async Task<ContactDto?> GetMessageByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var message = await _unitOfWork.Repository<ContactMessage>().GetByIdAsync(id);
        return message == null ? null : ContactMapper.ToDto(message);
    }

<<<<<<< HEAD
=======
    /// <summary>
    /// Creates and persists a new contact message, sends an email and an in-app notification, and returns the created message.
    /// </summary>
    /// <param name="dto">Data transfer object containing the sender's name, email, phone, subject, and message.</param>
    /// <param name="cancellationToken">Token to observe while waiting for the operation to complete.</param>
    /// <returns>The created contact message represented as a <see cref="ContactDto"/>.</returns>
>>>>>>> origin/master
    public async Task<ContactDto> CreateMessageAsync(ContactDto dto, CancellationToken cancellationToken = default)
    {
        var message = new ContactMessage
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Email = dto.Email,
            Phone = dto.Phone,
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

        return ContactMapper.ToDto(message);
    }

<<<<<<< HEAD
=======
    /// <summary>
    /// Marks the contact message with the specified id as read and updates its modification timestamp.
    /// </summary>
    /// <param name="id">The identifier of the contact message to mark as read.</param>
    /// <param name="cancellationToken">Token to observe while waiting for the operation to complete.</param>
    /// <exception cref="KeyNotFoundException">Thrown if no contact message exists with the specified <paramref name="id"/>.</exception>
>>>>>>> origin/master
    public async Task MarkAsReadAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var message = await _unitOfWork.Repository<ContactMessage>().GetByIdAsync(id);
        if (message == null)
            throw new KeyNotFoundException($"Contact message with id {id} not found");

        message.IsRead = true;
        message.UpdatedAt = DateTime.UtcNow;
        await _unitOfWork.CompleteAsync();
    }

<<<<<<< HEAD
=======
    /// <summary>
    /// Deletes the contact message identified by the given ID.
    /// </summary>
    /// <param name="id">The identifier of the contact message to delete.</param>
    /// <param name="cancellationToken">A token to observe while waiting for the operation to complete.</param>
    /// <exception cref="KeyNotFoundException">Thrown if no contact message exists with the specified <paramref name="id"/>.</exception>
>>>>>>> origin/master
    public async Task DeleteMessageAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var message = await _unitOfWork.Repository<ContactMessage>().GetByIdAsync(id);
        if (message == null)
            throw new KeyNotFoundException($"Contact message with id {id} not found");

        _unitOfWork.Repository<ContactMessage>().Delete(message);
        await _unitOfWork.CompleteAsync();
    }
}



