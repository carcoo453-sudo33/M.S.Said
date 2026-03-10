using Portfolio.API.Application.Features.Bio.DTOs;

namespace Portfolio.API.Application.Features.Bio.Services;

public interface IBioService
{
    Task<BioDto?> GetBioAsync(CancellationToken cancellationToken = default);
    Task<BioDto> UpdateBioAsync(Guid id, BioDto dto, CancellationToken cancellationToken = default);
}



