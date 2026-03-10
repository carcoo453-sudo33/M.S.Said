using Portfolio.API.Application.Features.Education.DTOs;

namespace Portfolio.API.Application.Features.Education.Services;

public interface IEducationService
{
    Task<IEnumerable<EducationDto>> GetEducationAsync();
    Task<EducationDto?> GetEducationByIdAsync(Guid id);
    Task<EducationDto> CreateEducationAsync(EducationDto dto);
    Task<EducationDto> UpdateEducationAsync(Guid id, EducationDto dto);
    Task DeleteEducationAsync(Guid id);
}
