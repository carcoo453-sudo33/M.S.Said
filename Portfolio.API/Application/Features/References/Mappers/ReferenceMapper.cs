using Portfolio.API.Entities;
using Portfolio.API.Application.Features.References.DTOs;

namespace Portfolio.API.Application.Features.References.Mappers;

public class ReferenceMapper
{
    public static ReferenceDto ToDto(Reference entity)
    {
        return new ReferenceDto
        {
            Id = entity.Id,
            Name = entity.Name,
            Name_Ar = entity.Name_Ar,
            Role = entity.Role,
            Role_Ar = entity.Role_Ar,
            Company = entity.Company,
            Company_Ar = entity.Company_Ar,
            Content = entity.Content,
            Content_Ar = entity.Content_Ar,
            ImagePath = entity.ImagePath,
            Phone = entity.Phone,
            Email = entity.Email,
            SocialLink = entity.SocialLink,
            PublishedAt = entity.PublishedAt,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt
        };
    }

    public static void UpdateEntity(Reference entity, ReferenceDto dto)
    {
        entity.Name = dto.Name;
        entity.Name_Ar = dto.Name_Ar;
        entity.Role = dto.Role;
        entity.Role_Ar = dto.Role_Ar;
        entity.Company = dto.Company;
        entity.Company_Ar = dto.Company_Ar;
        entity.Content = dto.Content;
        entity.Content_Ar = dto.Content_Ar;
        entity.ImagePath = dto.ImagePath;
        entity.Phone = dto.Phone;
        entity.Email = dto.Email;
        entity.SocialLink = dto.SocialLink;
        entity.PublishedAt = dto.PublishedAt;
        entity.UpdatedAt = DateTime.UtcNow;
    }
}
