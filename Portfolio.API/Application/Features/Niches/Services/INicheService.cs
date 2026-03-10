using Portfolio.API.Application.Features.Niches.DTOs;

namespace Portfolio.API.Application.Features.Niches.Services;

public interface INicheService
{
    Task<IEnumerable<NicheDto>> GetNichesAsync(CancellationToken cancellationToken = default);
    Task<NicheDto?> GetNicheByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<NicheDto> CreateNicheAsync(NicheDto dto, CancellationToken cancellationToken = default);
    Task<NicheDto> UpdateNicheAsync(Guid id, NicheDto dto, CancellationToken cancellationToken = default);
    Task DeleteNicheAsync(Guid id, CancellationToken cancellationToken = default);
}


