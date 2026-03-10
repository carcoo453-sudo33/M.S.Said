using Portfolio.API.Application.Features.Contact.DTOs;

namespace Portfolio.API.Application.Features.Contact.Services;

public interface IContactService
{
    Task<IEnumerable<ContactDto>> GetMessagesAsync();
    Task<ContactDto?> GetMessageByIdAsync(Guid id);
    Task<ContactDto> CreateMessageAsync(ContactDto dto);
    Task MarkAsReadAsync(Guid id);
    Task DeleteMessageAsync(Guid id);
}
