using Portfolio.API.Application.Features.Education.DTOs;

namespace Portfolio.API.Application.Features.Education.Services;

public interface IEducationService
{
    /// <summary>
/// Retrieves all education entries.
/// </summary>
/// <returns>An enumerable of <see cref="EducationDto"/> representing all education records.</returns>
Task<IEnumerable<EducationDto>> GetEducationAsync();
    /// <summary>
/// Retrieves a single education entry by its identifier.
/// </summary>
/// <param name="id">The identifier of the education entry to retrieve.</param>
/// <returns>The matching <see cref="EducationDto"/> if found, or <c>null</c> if no entry exists with the given id.</returns>
Task<EducationDto?> GetEducationByIdAsync(Guid id);
    /// <summary>
/// Creates a new education entry from the provided DTO.
/// </summary>
/// <param name="dto">Data transfer object containing the fields for the new education entry.</param>
/// <returns>The created <see cref="EducationDto"/> including any values set during creation (for example generated identifiers or timestamps).</returns>
Task<EducationDto> CreateEducationAsync(EducationDto dto);
    /// <summary>
/// Update an existing education entry identified by the given id with values from the provided DTO and return the updated entry.
/// </summary>
/// <param name="id">Identifier of the education entry to update.</param>
/// <param name="dto">DTO containing the updated education fields.</param>
/// <returns>The updated EducationDto.</returns>
Task<EducationDto> UpdateEducationAsync(Guid id, EducationDto dto);
    /// <summary>
/// Deletes the education entry with the specified identifier.
/// </summary>
/// <param name="id">The identifier of the education entry to delete.</param>
/// <returns>true if the education entry was deleted, false otherwise.</returns>
Task<bool> DeleteEducationAsync(Guid id);
}



