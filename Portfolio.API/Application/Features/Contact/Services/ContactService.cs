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

    public ContactService(IUnitOfWork unitOfWork, INotificationService notificationService, IEmailService emailService)
    {
        _unitOfWork = unitOfWork;
        _notificationService = notificationService;
        _emailService = emailService;
    }

    public async Task<IEnumerable<ContactDto>> GetMessagesAsync(int page = 1, int pageSize = 20, CancellationToken cancellationToken = default)
    {
        var messages = await _unitOfWork.Repository<ContactMessage>().GetAllAsync();
        return messages.OrderByDescending(m => m.SentAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(ContactMapper.ToDto);
    }

    public async Task<ContactDto?> GetMessageByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var message = await _unitOfWork.Repository<ContactMessage>().GetByIdAsync(id);
        return message == null ? null : ContactMapper.ToDto(message);
    }

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

    public async Task MarkAsReadAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var message = await _unitOfWork.Repository<ContactMessage>().GetByIdAsync(id);
        if (message == null)
            throw new KeyNotFoundException($"Contact message with id {id} not found");

        message.IsRead = true;
        message.UpdatedAt = DateTime.UtcNow;
        await _unitOfWork.CompleteAsync();
    }

    public async Task DeleteMessageAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var message = await _unitOfWork.Repository<ContactMessage>().GetByIdAsync(id);
        if (message == null)
            throw new KeyNotFoundException($"Contact message with id {id} not found");

        _unitOfWork.Repository<ContactMessage>().Delete(message);
        await _unitOfWork.CompleteAsync();
    }
}



