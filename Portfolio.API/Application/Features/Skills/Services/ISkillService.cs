using Portfolio.API.Application.Features.Skills.DTOs;

namespace Portfolio.API.Application.Features.Skills.Services;

public interface ISkillService
{
    /// <summary>
/// Retrieves all skill records.
/// </summary>
/// <returns>An enumerable of <see cref="SkillDto"/> containing all skills; empty if no skills exist.</returns>
Task<IEnumerable<SkillDto>> GetSkillsAsync();
    /// <summary>
/// Retrieves a skill by its identifier.
/// </summary>
/// <param name="id">The identifier of the skill to retrieve.</param>
/// <returns>The matching <see cref="SkillDto"/> if found; otherwise <c>null</c>.</returns>
Task<SkillDto?> GetSkillByIdAsync(Guid id);
    /// <summary>
/// Creates a new skill using the provided DTO.
/// </summary>
/// <param name="dto">The SkillDto containing data for the skill to create.</param>
/// <returns>The created SkillDto reflecting persisted values (for example, the assigned identifier).</returns>
Task<SkillDto> CreateSkillAsync(SkillDto dto);
    /// <summary>
/// Updates an existing skill identified by <paramref name="id"/> with values from <paramref name="dto"/>.
/// </summary>
/// <param name="id">Identifier of the skill to update.</param>
/// <param name="dto">Data transfer object containing the updated skill properties.</param>
/// <returns>The updated <see cref="SkillDto"/>.</returns>
Task<SkillDto> UpdateSkillAsync(Guid id, SkillDto dto);
    /// <summary>
/// Deletes the skill with the specified identifier.
/// </summary>
/// <param name="id">The identifier of the skill to delete.</param>
/// <returns>`true` if the skill was deleted, `false` otherwise.</returns>
Task<bool> DeleteSkillAsync(Guid id);
}



