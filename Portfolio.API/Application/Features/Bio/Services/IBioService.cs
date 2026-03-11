using Portfolio.API.Application.Features.Bio.DTOs;

namespace Portfolio.API.Application.Features.Bio.Services;

public interface IBioService
{
<<<<<<< HEAD
    Task<BioDto?> GetBioAsync(CancellationToken cancellationToken = default);
    Task<BioDto> UpdateBioAsync(Guid id, BioDto dto, CancellationToken cancellationToken = default);
=======
    /// <summary>
/// Retrieves the current bio data.
/// </summary>
/// <returns>The BioDto if available; otherwise, null.</returns>
Task<BioDto?> GetBioAsync(CancellationToken cancellationToken = default);
    /// <summary>
/// Updates the bio identified by the specified id using values from the provided DTO.
/// </summary>
/// <param name="id">The unique identifier of the bio to update.</param>
/// <param name="dto">A DTO containing the updated bio fields.</param>
/// <param name="cancellationToken">An optional token to cancel the operation.</param>
/// <returns>The updated <see cref="BioDto"/>.</returns>
Task<BioDto> UpdateBioAsync(Guid id, BioDto dto, CancellationToken cancellationToken = default);
>>>>>>> origin/master
}



