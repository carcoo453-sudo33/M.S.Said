using Portfolio.API.Application.Features.Contact.DTOs;

namespace Portfolio.API.Application.Features.Contact.Services;

public interface IContactService
{
<<<<<<< HEAD
    Task<IEnumerable<ContactDto>> GetMessagesAsync(int page = 1, int pageSize = 20, CancellationToken cancellationToken = default);
    Task<ContactDto?> GetMessageByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<ContactDto> CreateMessageAsync(ContactDto dto, CancellationToken cancellationToken = default);
    Task MarkAsReadAsync(Guid id, CancellationToken cancellationToken = default);
    Task DeleteMessageAsync(Guid id, CancellationToken cancellationToken = default);
=======
    /// <summary>
/// Retrieve a paged collection of contact messages.
/// </summary>
/// <param name="page">One-based page number to retrieve.</param>
/// <param name="pageSize">Number of items to include in a page.</param>
/// <returns>An enumerable of <see cref="ContactDto"/> containing the messages for the requested page.</returns>
Task<IEnumerable<ContactDto>> GetMessagesAsync(int page = 1, int pageSize = 20, CancellationToken cancellationToken = default);
    /// <summary>
/// Retrieves a single contact message by its unique identifier.
/// </summary>
/// <param name="id">The unique identifier of the contact message to retrieve.</param>
/// <param name="cancellationToken">Token to observe while awaiting the operation.</param>
/// <returns>The matching ContactDto if found, or <c>null</c> if no message exists with the specified identifier.</returns>
Task<ContactDto?> GetMessageByIdAsync(Guid id, CancellationToken cancellationToken = default);
    /// <summary>
/// Creates a new contact message from the provided DTO.
/// </summary>
/// <param name="dto">The contact message data to create.</param>
/// <returns>The created ContactDto representing the saved message.</returns>
Task<ContactDto> CreateMessageAsync(ContactDto dto, CancellationToken cancellationToken = default);
    /// <summary>
/// Marks the contact message with the specified identifier as read.
/// </summary>
/// <param name="id">Unique identifier of the message to mark as read.</param>
Task MarkAsReadAsync(Guid id, CancellationToken cancellationToken = default);
    /// <summary>
/// Deletes the contact message with the specified identifier.
/// </summary>
/// <param name="id">The unique identifier of the message to delete.</param>
Task DeleteMessageAsync(Guid id, CancellationToken cancellationToken = default);
>>>>>>> origin/master
}


