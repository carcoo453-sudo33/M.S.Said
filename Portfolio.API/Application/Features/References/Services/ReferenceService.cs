using Portfolio.API.Repositories;
using Portfolio.API.Application.Features.References.DTOs;
using Portfolio.API.Application.Features.References.Mappers;
using Portfolio.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace Portfolio.API.Application.Features.References.Services;

public class ReferenceService : IReferenceService
{
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of <see cref="ReferenceService"/> using the provided unit of work.
    /// </summary>
    /// <param name="unitOfWork">The unit-of-work used to access repositories and commit changes.</param>
    public ReferenceService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Gets all references and returns them as DTOs ordered by PublishedAt descending.
    /// </summary>
    /// <returns>An enumerable of ReferenceDto for all references, ordered by PublishedAt descending.</returns>
    public async Task<IEnumerable<ReferenceDto>> GetReferencesAsync()
    {
        var references = await _unitOfWork.Repository<Reference>()
            .Query()
            .AsNoTracking()
            .OrderByDescending(r => r.PublishedAt)
            .ToListAsync();
        return references.Select(ReferenceMapper.ToDto);
    }

    /// <summary>
    /// Retrieve a reference by its identifier.
    /// </summary>
    /// <param name="id">The identifier of the reference to retrieve.</param>
    /// <returns>`ReferenceDto` for the reference if found, `null` otherwise.</returns>
    public async Task<ReferenceDto?> GetReferenceByIdAsync(Guid id)
    {
        var reference = await _unitOfWork.Repository<Reference>().GetByIdAsync(id);
        return reference == null ? null : ReferenceMapper.ToDto(reference);
    }

    /// <summary>
    /// Creates a new Reference entity from the provided DTO, persists it, and returns the created DTO.
    /// </summary>
    /// <param name="dto">Values for the new reference; a new Id is generated if <see cref="Guid.Empty"/> is provided. CreatedAt is set to the current UTC time.</param>
    /// <returns>The persisted Reference represented as a <see cref="ReferenceDto"/>.</returns>
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
            PublishedAt = dto.PublishedAt,
            CreatedAt = DateTime.UtcNow
        };
        await _unitOfWork.Repository<Reference>().AddAsync(reference);
        await _unitOfWork.CompleteAsync();
        return ReferenceMapper.ToDto(reference);
    }

    /// <inheritdoc />
    public async Task<ReferenceDto?> UpdateReferenceAsync(Guid id, ReferenceDto dto)
    {
        var reference = await _unitOfWork.Repository<Reference>().GetByIdAsync(id);
        if (reference == null)
            return null;

        ReferenceMapper.UpdateEntity(reference, dto);
        await _unitOfWork.CompleteAsync();
        return ReferenceMapper.ToDto(reference);
    }

    /// <summary>
    /// Deletes the Reference with the specified identifier.
    /// </summary>
    /// <param name="id">The identifier of the reference to delete.</param>
    /// <returns>`true` if the reference was found and deleted, `false` otherwise.</returns>
    public async Task<bool> DeleteReferenceAsync(Guid id)
    {
        var reference = await _unitOfWork.Repository<Reference>().GetByIdAsync(id);
        if (reference == null)
            return false;

        _unitOfWork.Repository<Reference>().Delete(reference);
        await _unitOfWork.CompleteAsync();
        return true;
    }
}



