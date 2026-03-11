using Portfolio.API.Application.Features.References.DTOs;

namespace Portfolio.API.Application.Features.References.Services;

public interface IReferenceService
{
    /// <summary>
/// Retrieves all references.
/// </summary>
/// <returns>An enumerable of ReferenceDto representing all references.</returns>
Task<IEnumerable<ReferenceDto>> GetReferencesAsync();
    /// <summary>
    /// Gets a specific reference by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the reference.</param>
    /// <summary>
/// Retrieves a reference by its unique identifier.
/// </summary>
/// <param name="id">The unique identifier of the reference to retrieve.</param>
/// <returns>A <see cref="ReferenceDto"/> if found, <c>null</c> otherwise.</returns>
    Task<ReferenceDto?> GetReferenceByIdAsync(Guid id);

    /// <summary>
    /// Creates a new reference.
    /// </summary>
    /// <param name="dto">The reference data transfer object.</param>
    /// <summary>
/// Creates a new reference from the provided DTO.
/// </summary>
/// <param name="dto">The reference data to create.</param>
/// <returns>The created <see cref="ReferenceDto"/>.</returns>
    Task<ReferenceDto> CreateReferenceAsync(ReferenceDto dto);

    /// <summary>
    /// Updates an existing reference.
    /// </summary>
    /// <param name="id">The unique identifier of the reference to update.</param>
    /// <param name="dto">The reference data transfer object with updated values.</param>
    /// <summary>
/// Updates an existing reference identified by the provided id using values from the specified DTO.
/// </summary>
/// <param name="id">The unique identifier of the reference to update.</param>
/// <param name="dto">The DTO containing updated reference values.</param>
/// <returns>The updated <see cref="ReferenceDto"/> if found; otherwise, <c>null</c>.</returns>
    Task<ReferenceDto?> UpdateReferenceAsync(Guid id, ReferenceDto dto);

    /// <summary>
    /// Deletes a specific reference.
    /// </summary>
    /// <param name="id">The unique identifier of the reference to delete.</param>
    /// <summary>
/// Deletes the reference with the specified identifier.
/// </summary>
/// <param name="id">The unique identifier of the reference to delete.</param>
/// <returns><c>true</c> if the reference was deleted successfully; otherwise, <c>false</c>.</returns>
    Task<bool> DeleteReferenceAsync(Guid id);
}



