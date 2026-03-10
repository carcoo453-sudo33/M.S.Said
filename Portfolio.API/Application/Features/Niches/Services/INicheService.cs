using Portfolio.API.Application.Features.Niches.DTOs;

namespace Portfolio.API.Application.Features.Niches.Services;

public interface INicheService
{
    Task<IEnumerable<NicheDto>> GetNichesAsync();
    Task<NicheDto?> GetNicheByIdAsync(Guid id);
    Task<NicheDto> CreateNicheAsync(NicheDto dto);
    Task<NicheDto> UpdateNicheAsync(Guid id, NicheDto dto);
    Task DeleteNicheAsync(Guid id);
}



