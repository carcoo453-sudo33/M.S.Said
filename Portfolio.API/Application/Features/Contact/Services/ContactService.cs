using Portfolio.API.Entities;
using Portfolio.API.Repositories;
using Portfolio.API.Application.Features.Contact.DTOs;
using Portfolio.API.Application.Features.Contact.Mappers;
using Portfolio.API.Application.Features.Notifications.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;

namespace Portfolio.API.Application.Features.Contact.Services;

public class ContactService : IContactService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly INotificationService _notificationService;
    private readonly IEmailService _emailService;
    private readonly IMemoryCache _cache;
    private readonly ILogger<ContactService> _logger;
    private readonly IServiceScopeFactory _serviceScopeFactory;

    /// <summary>
    /// Initializes a new instance of <see cref="ContactService"/> with its required dependencies.
    /// </summary>
    public ContactService(
        IUnitOfWork unitOfWork, 
        INotificationService notificationService, 
        IEmailService emailService,
        IMemoryCache cache,
        ILogger<ContactService> logger,
        IServiceScopeFactory serviceScopeFactory)
    {
        _unitOfWork = unitOfWork;
        _notificationService = notificationService;
        _emailService = emailService;
        _cache = cache;
        _logger = logger;
        _serviceScopeFactory = serviceScopeFactory;
    }

    /// <summary>
    /// Retrieves a paginated list of contact messages ordered from newest to oldest.
    /// </summary>
    /// <param name="page">1-based page number to return.</param>
    /// <param name="pageSize">Number of items per page.</param>
    /// <param name="cancellationToken">Token to cancel the operation.</param>
    /// <returns>A sequence of ContactDto for the requested page ordered by SentAt descending.</returns>
    public async Task<IEnumerable<ContactDto>> GetMessagesAsync(int page = 1, int pageSize = 20, CancellationToken cancellationToken = default)
    {
        var cacheKey = $"ContactMessages_Page{page}_Size{pageSize}";
        if (_cache.TryGetValue(cacheKey, out IEnumerable<ContactDto>? cachedMessages) && cachedMessages != null)
        {
            return cachedMessages;
        }

        var messages = await _unitOfWork.Repository<ContactMessage>()
            .Query()
            .AsNoTracking()
            .OrderByDescending(m => m.SentAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
            
        var result = messages.Select(ContactMapper.ToDto).ToList();

        _cache.Set(cacheKey, result, new MemoryCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5)
        });

        return result;
    }

    /// <summary>
    /// Retrieves a contact message by its identifier and maps it to a ContactDto.
    /// </summary>
    /// <returns>The message mapped to a ContactDto, or null if no message exists with the specified id.</returns>
    public async Task<ContactDto?> GetMessageByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var message = await _unitOfWork.Repository<ContactMessage>().GetByIdAsync(id);
        return message == null ? null : ContactMapper.ToDto(message);
    }

    /// <summary>
    /// Creates and persists a new contact message, sends an email and an in-app notification, and returns the created message.
    /// </summary>
    /// <param name="dto">Data transfer object containing the sender's name, email, phone, subject, and message.</param>
    /// <param name="cancellationToken">Token to observe while waiting for the operation to complete.</param>
    /// <returns>The created contact message represented as a <see cref="ContactDto"/>.</returns>
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

        var sw = System.Diagnostics.Stopwatch.StartNew();
        _logger.LogInformation("Creating contact message for {SenderEmail}...", dto.Email);

        await _unitOfWork.Repository<ContactMessage>().AddAsync(message);
        _logger.LogInformation("Message added to repository in {Elapsed}ms", sw.ElapsedMilliseconds);
        
        await _unitOfWork.CompleteAsync();
        _logger.LogInformation("UnitOfWork completed in {Elapsed}ms", sw.ElapsedMilliseconds);

        // Clear contact cache
        _cache.Remove("ContactMessages_Page1_Size20");

        // Send email notification in background to avoid blocking the request
        _ = Task.Run(async () => 
        {
            using var scope = _serviceScopeFactory.CreateScope();
            var scopedEmailService = scope.ServiceProvider.GetRequiredService<IEmailService>();
            try 
            {
                await scopedEmailService.SendContactEmailAsync(dto.Name, dto.Email, dto.Subject, dto.Message, CancellationToken.None);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Background email sending failed");
            }
        }, CancellationToken.None);

        // Create in-app notification in background using a separate scope
        _ = Task.Run(async () => 
        {
            using var scope = _serviceScopeFactory.CreateScope();
            var scopedNotificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();
            try 
            {
                await scopedNotificationService.CreateNotificationAsync(
                    type: "ContactForm",
                    title: $"New Contact Message from {dto.Name}",
                    message: dto.Subject,
                    link: null,
                    icon: "mail",
                    relatedEntityId: message.Id.ToString(),
                    relatedEntityType: "ContactMessage",
                    senderName: dto.Name,
                    senderEmail: dto.Email,
                    cancellationToken: CancellationToken.None
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Background notification creation failed");
            }
        }, CancellationToken.None);

        _logger.LogInformation("CreateMessageAsync returning ContactDto in {Elapsed}ms", sw.ElapsedMilliseconds);
        return ContactMapper.ToDto(message);
    }

    /// <summary>
    /// Marks the contact message with the specified id as read and updates its modification timestamp.
    /// </summary>
    /// <param name="id">The identifier of the contact message to mark as read.</param>
    /// <param name="cancellationToken">Token to observe while waiting for the operation to complete.</param>
    /// <exception cref="KeyNotFoundException">Thrown if no contact message exists with the specified <paramref name="id"/>.</exception>
    public async Task MarkAsReadAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var message = await _unitOfWork.Repository<ContactMessage>().GetByIdAsync(id);
        if (message == null)
            throw new KeyNotFoundException($"Contact message with id {id} not found");

        message.IsRead = true;
        message.UpdatedAt = DateTime.UtcNow;
        await _unitOfWork.CompleteAsync();
    }

    /// <summary>
    /// Deletes the contact message identified by the given ID.
    /// </summary>
    /// <param name="id">The identifier of the contact message to delete.</param>
    /// <param name="cancellationToken">A token to observe while waiting for the operation to complete.</param>
    /// <exception cref="KeyNotFoundException">Thrown if no contact message exists with the specified <paramref name="id"/>.</exception>
    public async Task DeleteMessageAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var message = await _unitOfWork.Repository<ContactMessage>().GetByIdAsync(id);
        if (message == null)
            throw new KeyNotFoundException($"Contact message with id {id} not found");

        _unitOfWork.Repository<ContactMessage>().Delete(message);
        await _unitOfWork.CompleteAsync();
    }
}



