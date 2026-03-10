using Portfolio.API.Entities;
using Portfolio.API.Repositories;
using Portfolio.API.Application.Features.Skills.DTOs;
using Portfolio.API.Application.Features.Skills.Mappers;

namespace Portfolio.API.Application.Features.Skills.Services;

public class SkillService : ISkillService
{
    private readonly IUnitOfWork _unitOfWork;

    public SkillService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<SkillDto>> GetSkillsAsync()
    {
        var skills = await _unitOfWork.Repository<Skill>().GetAllAsync();
        return skills.OrderBy(s => s.Order).Select(SkillMapper.ToDto);
    }

    public async Task<SkillDto?> GetSkillByIdAsync(Guid id)
    {
        var skill = await _unitOfWork.Repository<Skill>().GetByIdAsync(id);
        return skill == null ? null : SkillMapper.ToDto(skill);
    }

    public async Task<SkillDto> CreateSkillAsync(SkillDto dto)
    {
        var skill = new Skill
        {
            Id = dto.Id != Guid.Empty ? dto.Id : Guid.NewGuid(),
            Name = dto.Name,
            IconPath = dto.IconPath,
            Order = dto.Order
        };
        await _unitOfWork.Repository<Skill>().AddAsync(skill);
        await _unitOfWork.CompleteAsync();
        return SkillMapper.ToDto(skill);
    }

    public async Task<SkillDto> UpdateSkillAsync(Guid id, SkillDto dto)
    {
        var skill = await _unitOfWork.Repository<Skill>().GetByIdAsync(id);
        if (skill == null)
            throw new KeyNotFoundException($"Skill with id {id} not found");

        SkillMapper.UpdateEntity(skill, dto);
        await _unitOfWork.CompleteAsync();
        return SkillMapper.ToDto(skill);
    }

    public async Task DeleteSkillAsync(Guid id)
    {
        var skill = await _unitOfWork.Repository<Skill>().GetByIdAsync(id);
        if (skill == null)
            throw new KeyNotFoundException($"Skill with id {id} not found");

        _unitOfWork.Repository<Skill>().Delete(skill);
        await _unitOfWork.CompleteAsync();
    }
}



