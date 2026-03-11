using Portfolio.API.Entities;
using Portfolio.API.Repositories;
using Portfolio.API.Application.Features.Education.DTOs;
using Portfolio.API.Application.Features.Education.Mappers;
using Microsoft.EntityFrameworkCore;
using EducationEntity = Portfolio.API.Entities.Education;

namespace Portfolio.API.Application.Features.Education.Services;

public class EducationService : IEducationService
{
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of <see cref="EducationService"/> with the specified unit of work.
    /// </summary>
    /// <param name="unitOfWork">Unit of work used to access repositories and persist changes.</param>
    public EducationService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Retrieve all education records ordered by Duration descending and map them to DTOs.
    /// </summary>
    /// <returns>An IEnumerable&lt;EducationDto&gt; containing all education records mapped to DTOs, ordered by Duration descending.</returns>
    public async Task<IEnumerable<EducationDto>> GetEducationAsync()
    {
        var education = await _unitOfWork.Repository<EducationEntity>()
            .Query()
            .AsNoTracking()
            .OrderByDescending(e => e.Duration)
            .ToListAsync();
        return education.Select(EducationMapper.ToDto);
    }

    /// <summary>
    /// Retrieve a single education record by its identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the education record to retrieve.</param>
    /// <returns>The <see cref="EducationDto"/> for the specified id, or <c>null</c> if no matching record exists.</returns>
    public async Task<EducationDto?> GetEducationByIdAsync(Guid id)
    {
        var education = await _unitOfWork.Repository<EducationEntity>().GetByIdAsync(id);
        return education == null ? null : EducationMapper.ToDto(education);
    }

    /// <summary>
    /// Creates a new education entry from the provided DTO and persists it to the repository.
    /// </summary>
    /// <param name="dto">DTO containing the education data; if <see cref="Guid.Empty"/> is provided for Id, a new Id will be generated.</param>
    /// <returns>The created education as an <see cref="EducationDto"/> reflecting the persisted entity.</returns>
    public async Task<EducationDto> CreateEducationAsync(EducationDto dto)
    {
        var entity = new EducationEntity
        {
            Id = dto.Id != Guid.Empty ? dto.Id : Guid.NewGuid()
        };
        EducationMapper.UpdateEntity(entity, dto);
        await _unitOfWork.Repository<EducationEntity>().AddAsync(entity);
        await _unitOfWork.CompleteAsync();
        return EducationMapper.ToDto(entity);
    }

    /// <summary>
    /// Updates an existing Education entity identified by the specified id with values from the provided DTO.
    /// </summary>
    /// <param name="id">The identifier of the Education to update.</param>
    /// <param name="dto">DTO containing the new values to apply to the Education.</param>
    /// <returns>The updated Education mapped to an EducationDto.</returns>
    /// <exception cref="KeyNotFoundException">Thrown if no Education with the specified id exists.</exception>
    public async Task<EducationDto> UpdateEducationAsync(Guid id, EducationDto dto)
    {
        var education = await _unitOfWork.Repository<EducationEntity>().GetByIdAsync(id);
        if (education == null)
            throw new KeyNotFoundException($"Education with id {id} not found");

        EducationMapper.UpdateEntity(education, dto);
        await _unitOfWork.CompleteAsync();
        return EducationMapper.ToDto(education);
    }

    /// <summary>
    /// Deletes the education entity with the specified id.
    /// </summary>
    /// <returns>True if the entity was found and deleted; false otherwise.</returns>
    public async Task<bool> DeleteEducationAsync(Guid id)
    {
        var education = await _unitOfWork.Repository<EducationEntity>().GetByIdAsync(id);
        if (education == null)
            return false;

        _unitOfWork.Repository<EducationEntity>().Delete(education);
        await _unitOfWork.CompleteAsync();
        return true;
    }
}



