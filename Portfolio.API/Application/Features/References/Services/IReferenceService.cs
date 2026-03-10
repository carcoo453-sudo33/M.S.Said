using Portfolio.API.Application.Features.References.DTOs;

namespace Portfolio.API.Application.Features.References.Services;

public interface IReferenceService
{
    Task<IEnumerable<ReferenceDto>> GetReferencesAsync();
    Task<ReferenceDto?> GetReferenceByIdAsync(Guid id);
    Task<ReferenceDto> CreateReferenceAsync(ReferenceDto dto);
    Task<ReferenceDto> UpdateReferenceAsync(Guid id, ReferenceDto dto);
    Task DeleteReferenceAsync(Guid id);
}



