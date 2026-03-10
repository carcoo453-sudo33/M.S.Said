using Portfolio.API.Entities;
using Portfolio.API.Repositories;
using Portfolio.API.Application.Features.Education.DTOs;
using Portfolio.API.Application.Features.Education.Mappers;

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
        var education = await _unitOfWork.Repository<Education>().GetAllAsync();
        return education.OrderByDescending(e => e.Duration).Select(EducationMapper.ToDto);
    }

    public async Task<EducationDto?> GetEducationByIdAsync(Guid id)
    {
        var education = await _unitOfWork.Repository<Education>().GetByIdAsync(id);
        return education == null ? null : EducationMapper.ToDto(education);
    }

    public async Task<EducationDto> CreateEducationAsync(EducationDto dto)
    {
        var entity = new Education
        {
            Id = dto.Id != Guid.Empty ? dto.Id : Guid.NewGuid()
        };
        EducationMapper.UpdateEntity(entity, dto);
        await _unitOfWork.Repository<Education>().AddAsync(entity);
        await _unitOfWork.CompleteAsync();
        return EducationMapper.ToDto(entity);
    }

    public async Task<EducationDto> UpdateEducationAsync(Guid id, EducationDto dto)
    {
        var education = await _unitOfWork.Repository<Education>().GetByIdAsync(id);
        if (education == null)
            throw new KeyNotFoundException($"Education with id {id} not found");

        EducationMapper.UpdateEntity(education, dto);
        await _unitOfWork.CompleteAsync();
        return EducationMapper.ToDto(education);
    }

    public async Task DeleteEducationAsync(Guid id)
    {
        var education = await _unitOfWork.Repository<Education>().GetByIdAsync(id);
        if (education == null)
            throw new KeyNotFoundException($"Education with id {id} not found");

        _unitOfWork.Repository<Education>().Delete(education);
        await _unitOfWork.CompleteAsync();
    }
}
