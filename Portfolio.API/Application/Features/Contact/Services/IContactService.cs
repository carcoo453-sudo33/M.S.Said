using Portfolio.API.Application.Features.Contact.DTOs;

namespace Portfolio.API.Application.Features.Contact.Services;

public interface IContactService
{
    Task<IEnumerable<ContactDto>> GetMessagesAsync(int page = 1, int pageSize = 20, CancellationToken cancellationToken = default);
    Task<ContactDto?> GetMessageByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<ContactDto> CreateMessageAsync(ContactDto dto, CancellationToken cancellationToken = default);
    Task MarkAsReadAsync(Guid id, CancellationToken cancellationToken = default);
    Task DeleteMessageAsync(Guid id, CancellationToken cancellationToken = default);
}


