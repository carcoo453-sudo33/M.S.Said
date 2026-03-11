using Portfolio.API.Application.Features.Niches.DTOs;

namespace Portfolio.API.Application.Features.Niches.Services;

public interface INicheService
{
    /// <summary>
/// Retrieves all niches.
/// </summary>
/// <param name="cancellationToken">A token to cancel the operation.</param>
/// <returns>An enumerable of <see cref="NicheDto"/> containing all niches.</returns>
Task<IEnumerable<NicheDto>> GetNichesAsync(CancellationToken cancellationToken = default);
    /// <summary>
/// Retrieves a niche by its unique identifier.
/// </summary>
/// <param name="id">The unique identifier of the niche to retrieve.</param>
/// <returns>A <see cref="NicheDto"/> for the specified niche, or null if no matching niche exists.</returns>
Task<NicheDto?> GetNicheByIdAsync(Guid id, CancellationToken cancellationToken = default);
    /// <summary>
/// Creates a new niche from the provided DTO and returns the created representation.
/// </summary>
/// <param name="dto">The niche data to create; the returned DTO may include server-assigned values or other updated fields.</param>
/// <returns>The created NicheDto with any assigned identifiers or server-populated fields.</returns>
Task<NicheDto> CreateNicheAsync(NicheDto dto, CancellationToken cancellationToken = default);
    /// <summary>
/// Updates an existing niche identified by the given id with the values from the provided DTO.
/// </summary>
/// <param name="id">The unique identifier of the niche to update.</param>
/// <param name="dto">The data to apply to the niche.</param>
/// <returns>The updated NicheDto representing the niche after modification.</returns>
Task<NicheDto> UpdateNicheAsync(Guid id, NicheDto dto, CancellationToken cancellationToken = default);
    /// <summary>
/// Deletes the niche identified by the provided unique identifier.
/// </summary>
/// <param name="id">The unique identifier of the niche to delete.</param>
/// <param name="cancellationToken">Optional token to cancel the operation.</param>
Task DeleteNicheAsync(Guid id, CancellationToken cancellationToken = default);
}


