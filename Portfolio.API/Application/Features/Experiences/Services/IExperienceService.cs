using Portfolio.API.Application.Features.Experiences.DTOs;

namespace Portfolio.API.Application.Features.Experiences.Services;

public interface IExperienceService
{
<<<<<<< HEAD
    Task<IEnumerable<ExperienceDto>> GetExperiencesAsync();
    Task<ExperienceDto?> GetExperienceByIdAsync(Guid id);
    Task<ExperienceDto> CreateExperienceAsync(ExperienceDto dto);
    Task<ExperienceDto> UpdateExperienceAsync(Guid id, ExperienceDto dto);
    Task<bool> DeleteExperienceAsync(Guid id);
=======
    /// <summary>
/// Retrieves all experiences.
/// </summary>
/// <returns>An IEnumerable of ExperienceDto containing all experiences.</returns>
Task<IEnumerable<ExperienceDto>> GetExperiencesAsync();
    /// <summary>
/// Retrieves a single experience by its unique identifier.
/// </summary>
/// <param name="id">The unique identifier of the experience to retrieve.</param>
/// <returns>The experience DTO with the specified identifier, or <c>null</c> if no matching experience exists.</returns>
Task<ExperienceDto?> GetExperienceByIdAsync(Guid id);
    /// <summary>
/// Creates a new experience from the provided DTO.
/// </summary>
/// <param name="dto">DTO containing the properties for the experience to create.</param>
/// <returns>The created ExperienceDto populated with persisted values (for example an assigned identifier).</returns>
Task<ExperienceDto> CreateExperienceAsync(ExperienceDto dto);
    /// <summary>
/// Updates the experience with the specified identifier using values from the provided DTO.
/// </summary>
/// <param name="id">The identifier of the experience to update.</param>
/// <param name="dto">A DTO containing the updated experience data.</param>
/// <returns>The updated <see cref="ExperienceDto"/>.</returns>
Task<ExperienceDto> UpdateExperienceAsync(Guid id, ExperienceDto dto);
    /// <summary>
/// Deletes the experience with the specified identifier.
/// </summary>
/// <param name="id">The identifier of the experience to delete.</param>
/// <returns>`true` if the experience was deleted; `false` otherwise.</returns>
Task<bool> DeleteExperienceAsync(Guid id);
>>>>>>> origin/master
}



