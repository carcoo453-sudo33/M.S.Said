using Portfolio.API.Application.Features.Bio.DTOs;

namespace Portfolio.API.Application.Features.Bio.Services;

public interface IBioService
{
    Task<BioDto?> GetBioAsync();
    Task<BioDto> UpdateBioAsync(Guid id, BioDto dto);
}



