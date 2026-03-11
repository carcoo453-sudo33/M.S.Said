using Portfolio.API.Entities;
using Portfolio.API.Application.Features.Contact.DTOs;

namespace Portfolio.API.Application.Features.Contact.Mappers;

public static class ContactMapper{
    /// <summary>
    /// Maps a ContactMessage entity to a ContactDto by copying relevant properties.
    /// </summary>
    /// <param name="entity">The source ContactMessage to map from.</param>
    /// <returns>A ContactDto populated with values from the provided entity.</returns>
    public static ContactDto ToDto(ContactMessage entity)
    {
        return new ContactDto
        {
            Id = entity.Id,
            Name = entity.Name,
            Email = entity.Email,
            Phone = entity.Phone,
            Subject = entity.Subject,
            Message = entity.Message,
            SentAt = entity.SentAt,
            IsRead = entity.IsRead,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt
        };
    }

    /// <summary>
    /// Copies relevant fields from a ContactDto into the provided ContactMessage instance, updating the entity in place.
    /// </summary>
    /// <param name="entity">The ContactMessage to modify.</param>
    /// <param name="dto">The source ContactDto whose values will be applied to the entity. Name, Email, Phone, Subject, Message, SentAt and IsRead are copied; UpdatedAt is set to the current UTC time.</param>
    public static void UpdateEntity(ContactMessage entity, ContactDto dto)
    {
        entity.Name = dto.Name;
        entity.Email = dto.Email;
        entity.Phone = dto.Phone;
        entity.Subject = dto.Subject;
        entity.Message = dto.Message;
        entity.SentAt = dto.SentAt;
        entity.IsRead = dto.IsRead;
        entity.UpdatedAt = DateTime.UtcNow;
    }
}



