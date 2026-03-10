using Portfolio.API.Application.Features.References.DTOs;

namespace Portfolio.API.Application.Features.References.Services;

public interface IReferenceService
{
    Task<IEnumerable<ReferenceDto>> GetReferencesAsync();
    /// <summary>
    /// Gets a specific reference by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the reference.</param>
    /// <returns>A <see cref="ReferenceDto"/> if found; otherwise, <c>null</c>.</returns>
    Task<ReferenceDto?> GetReferenceByIdAsync(Guid id);

    /// <summary>
    /// Creates a new reference.
    /// </summary>
    /// <param name="dto">The reference data transfer object.</param>
    /// <returns>The created <see cref="ReferenceDto"/>.</returns>
    Task<ReferenceDto> CreateReferenceAsync(ReferenceDto dto);

    /// <summary>
    /// Updates an existing reference.
    /// </summary>
    /// <param name="id">The unique identifier of the reference to update.</param>
    /// <param name="dto">The reference data transfer object with updated values.</param>
    /// <returns>The updated <see cref="ReferenceDto"/> if found; otherwise, <c>null</c>.</returns>
    Task<ReferenceDto?> UpdateReferenceAsync(Guid id, ReferenceDto dto);

    /// <summary>
    /// Deletes a specific reference.
    /// </summary>
    /// <param name="id">The unique identifier of the reference to delete.</param>
    /// <returns><c>true</c> if the reference was deleted successfully; otherwise, <c>false</c>.</returns>
    Task<bool> DeleteReferenceAsync(Guid id);
}



