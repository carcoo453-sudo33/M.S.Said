using Portfolio.API.Entities;
using Portfolio.API.Repositories;
using Portfolio.API.Application.Features.Education.DTOs;
using Portfolio.API.Application.Features.Education.Mappers;
using EducationEntity = Portfolio.API.Entities.Education;

namespace Portfolio.API.Application.Features.Education.Services;

public class EducationService : IEducationService
{
    private readonly IUnitOfWork _unitOfWork;

    public EducationService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<EducationDto>> GetEducationAsync()
    {
        var education = await _unitOfWork.Repository<EducationEntity>().GetAllAsync();
        return education.OrderByDescending(e => e.Duration).Select(EducationMapper.ToDto);
    }

    public async Task<EducationDto?> GetEducationByIdAsync(Guid id)
    {
        var education = await _unitOfWork.Repository<EducationEntity>().GetByIdAsync(id);
        return education == null ? null : EducationMapper.ToDto(education);
    }

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

    public async Task<EducationDto> UpdateEducationAsync(Guid id, EducationDto dto)
    {
        var education = await _unitOfWork.Repository<EducationEntity>().GetByIdAsync(id);
        if (education == null)
            throw new KeyNotFoundException($"Education with id {id} not found");

        EducationMapper.UpdateEntity(education, dto);
        await _unitOfWork.CompleteAsync();
        return EducationMapper.ToDto(education);
    }

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



