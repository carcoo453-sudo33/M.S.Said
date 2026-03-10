using Portfolio.API.Entities;
using Portfolio.API.Repositories;
using Portfolio.API.Application.Features.Experiences.DTOs;
using Portfolio.API.Application.Features.Experiences.Mappers;
using EducationEntity = Portfolio.API.Entities.Education;

namespace Portfolio.API.Application.Features.Experiences.Services;

public class ExperienceService : IExperienceService
{
    private readonly IUnitOfWork _unitOfWork;

    public ExperienceService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<ExperienceDto>> GetExperiencesAsync()
    {
        var experiences = await _unitOfWork.Repository<EducationEntity>().GetAllAsync();
        return experiences
            .OrderByDescending(e => e.IsCompleted)
            .ThenByDescending(e => ExtractYear(e.Duration))
            .ThenByDescending(e => e.Duration)
            .Select(ExperienceMapper.ToDto);
    }

    public async Task<ExperienceDto?> GetExperienceByIdAsync(Guid id)
    {
        var experience = await _unitOfWork.Repository<EducationEntity>().GetByIdAsync(id);
        return experience == null ? null : ExperienceMapper.ToDto(experience);
    }

    public async Task<ExperienceDto> CreateExperienceAsync(ExperienceDto dto)
    {
        var entity = new EducationEntity
        {
            Id = dto.Id != Guid.Empty ? dto.Id : Guid.NewGuid()
        };
        ExperienceMapper.UpdateEntity(entity, dto);
        await _unitOfWork.Repository<EducationEntity>().AddAsync(entity);
        await _unitOfWork.CompleteAsync();
        return ExperienceMapper.ToDto(entity);
    }

    public async Task<ExperienceDto> UpdateExperienceAsync(Guid id, ExperienceDto dto)
    {
        var experience = await _unitOfWork.Repository<EducationEntity>().GetByIdAsync(id);
        if (experience == null)
            throw new KeyNotFoundException($"Experience with id {id} not found");

        ExperienceMapper.UpdateEntity(experience, dto);
        await _unitOfWork.CompleteAsync();
        return ExperienceMapper.ToDto(experience);
    }

    public async Task<bool> DeleteExperienceAsync(Guid id)
    {
        var experience = await _unitOfWork.Repository<EducationEntity>().GetByIdAsync(id);
        if (experience == null)
            return false;

        _unitOfWork.Repository<EducationEntity>().Delete(experience);
        await _unitOfWork.CompleteAsync();
        return true;
    }

    private int ExtractYear(string duration)
    {
        if (string.IsNullOrEmpty(duration)) return 0;
        
        var parts = duration.Split(new[] { '-', '/' }, StringSplitOptions.RemoveEmptyEntries);
        
        foreach (var part in parts)
        {
            var trimmed = part.Trim();
            if (int.TryParse(trimmed, out int year) && year >= 2000 && year <= 2100)
            {
                return year;
            }
            if (trimmed.Length >= 4)
            {
                var lastFour = trimmed.Substring(trimmed.Length - 4);
                if (int.TryParse(lastFour, out int yearFromEnd) && yearFromEnd >= 2000 && yearFromEnd <= 2100)
                {
                    return yearFromEnd;
                }
            }
        }
        
        return 0;
    }
}



