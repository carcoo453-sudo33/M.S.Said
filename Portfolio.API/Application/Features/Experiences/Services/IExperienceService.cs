using Portfolio.API.Application.Features.Experiences.DTOs;

namespace Portfolio.API.Application.Features.Experiences.Services;

public interface IExperienceService
{
    Task<IEnumerable<ExperienceDto>> GetExperiencesAsync();
    Task<ExperienceDto?> GetExperienceByIdAsync(Guid id);
    Task<ExperienceDto> CreateExperienceAsync(ExperienceDto dto);
    Task<ExperienceDto> UpdateExperienceAsync(Guid id, ExperienceDto dto);
    Task DeleteExperienceAsync(Guid id);
}
