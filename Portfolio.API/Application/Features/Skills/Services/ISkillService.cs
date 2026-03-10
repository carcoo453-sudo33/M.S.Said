using Portfolio.API.Application.Features.Skills.DTOs;

namespace Portfolio.API.Application.Features.Skills.Services;

public interface ISkillService
{
    Task<IEnumerable<SkillDto>> GetSkillsAsync();
    Task<SkillDto?> GetSkillByIdAsync(Guid id);
    Task<SkillDto> CreateSkillAsync(SkillDto dto);
    Task<SkillDto> UpdateSkillAsync(Guid id, SkillDto dto);
    Task DeleteSkillAsync(Guid id);
}



