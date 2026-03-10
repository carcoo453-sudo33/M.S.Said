using Portfolio.API.Entities;
using Portfolio.API.Application.Features.Contact.DTOs;

namespace Portfolio.API.Application.Features.Contact.Mappers;

public static class ContactMapper{
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



