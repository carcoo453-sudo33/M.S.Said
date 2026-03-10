using Portfolio.API.Entities;
using Portfolio.API.Repositories;
using Portfolio.API.Application.Features.References.DTOs;
using Portfolio.API.Application.Features.References.Mappers;

namespace Portfolio.API.Application.Features.References.Services;

public class ReferenceService : IReferenceService
{
    private readonly IUnitOfWork _unitOfWork;

    public ReferenceService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<ReferenceDto>> GetReferencesAsync()
    {
        var references = await _unitOfWork.Repository<Reference>().GetAllAsync();
        return references.OrderByDescending(r => r.PublishedAt).Select(ReferenceMapper.ToDto);
    }

    public async Task<ReferenceDto?> GetReferenceByIdAsync(Guid id)
    {
        var reference = await _unitOfWork.Repository<Reference>().GetByIdAsync(id);
        return reference == null ? null : ReferenceMapper.ToDto(reference);
    }

    public async Task<ReferenceDto> CreateReferenceAsync(ReferenceDto dto)
    {
        var reference = new Reference
        {
            Id = dto.Id != Guid.Empty ? dto.Id : Guid.NewGuid(),
            Name = dto.Name,
            Name_Ar = dto.Name_Ar,
            Role = dto.Role,
            Role_Ar = dto.Role_Ar,
            Company = dto.Company,
            Company_Ar = dto.Company_Ar,
            Content = dto.Content,
            Content_Ar = dto.Content_Ar,
            ImagePath = dto.ImagePath,
            Phone = dto.Phone,
            Email = dto.Email,
            SocialLink = dto.SocialLink,
            PublishedAt = dto.PublishedAt
        };
        await _unitOfWork.Repository<Reference>().AddAsync(reference);
        await _unitOfWork.CompleteAsync();
        return ReferenceMapper.ToDto(reference);
    }

    public async Task<ReferenceDto> UpdateReferenceAsync(Guid id, ReferenceDto dto)
    {
        var reference = await _unitOfWork.Repository<Reference>().GetByIdAsync(id);
        if (reference == null)
            throw new KeyNotFoundException($"Reference with id {id} not found");

        ReferenceMapper.UpdateEntity(reference, dto);
        await _unitOfWork.CompleteAsync();
        return ReferenceMapper.ToDto(reference);
    }

    public async Task DeleteReferenceAsync(Guid id)
    {
        var reference = await _unitOfWork.Repository<Reference>().GetByIdAsync(id);
        if (reference == null)
            throw new KeyNotFoundException($"Reference with id {id} not found");

        _unitOfWork.Repository<Reference>().Delete(reference);
        await _unitOfWork.CompleteAsync();
    }
}
