using Portfolio.API.Entities;
using Portfolio.API.Repositories;
using Portfolio.API.Application.Features.Experiences.DTOs;
using Portfolio.API.Application.Features.Experiences.Mappers;
using Microsoft.EntityFrameworkCore;

namespace Portfolio.API.Application.Features.Experiences.Services;

public class ExperienceService : IExperienceService
{
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="ExperienceService"/> class with the specified unit-of-work.
    /// </summary>
    /// <param name="unitOfWork">The unit-of-work used for repository access and committing data changes.</param>
    public ExperienceService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Retrieve all experiences, ordered with current items first, then by year extracted from the duration (descending), then by duration (descending), and map them to DTOs.
    /// </summary>
    /// <returns>An <see cref="IEnumerable{ExperienceDto}"/> of all experiences mapped to DTOs, ordered by current status, extracted year (descending), and duration (descending).</returns>
    public async Task<IEnumerable<ExperienceDto>> GetExperiencesAsync()
    {
        var experiences = await _unitOfWork.Repository<Experience>().GetAllAsync();
        return experiences
            .OrderByDescending(e => e.IsCurrent)
            .ThenByDescending(e => ExtractYear(e.Duration))
            .ThenByDescending(e => e.Duration)
            .Select(ExperienceMapper.ToDto);
    }

    /// <summary>
    /// Retrieves the experience with the specified identifier.
    /// </summary>
    /// <returns>The matching ExperienceDto if found, or null if no experience exists with the given id.</returns>
    public async Task<ExperienceDto?> GetExperienceByIdAsync(Guid id)
    {
        var experience = await _unitOfWork.Repository<Experience>().GetByIdAsync(id);
        return experience == null ? null : ExperienceMapper.ToDto(experience);
    }

    /// <summary>
    /// Creates a new experience record from the provided DTO and persists it to storage.
    /// </summary>
    /// <param name="dto">The DTO containing values for the new experience; if <see cref="Guid"/> Id is empty a new Id will be generated.</param>
    /// <returns>The created <see cref="ExperienceDto"/> reflecting persisted values, including the assigned Id.</returns>
    public async Task<ExperienceDto> CreateExperienceAsync(ExperienceDto dto)
    {
        var entity = new Experience
        {
            Id = dto.Id != Guid.Empty ? dto.Id : Guid.NewGuid()
        };
        ExperienceMapper.UpdateEntity(entity, dto);
        await _unitOfWork.Repository<Experience>().AddAsync(entity);
        await _unitOfWork.CompleteAsync();
        return ExperienceMapper.ToDto(entity);
    }

    /// <summary>
    /// Updates an existing experience with values from the provided DTO.
    /// </summary>
    /// <param name="id">Identifier of the experience to update.</param>
    /// <param name="dto">DTO containing the values to apply to the experience.</param>
    /// <returns>The updated experience as an <see cref="ExperienceDto"/>.</returns>
    /// <exception cref="KeyNotFoundException">Thrown when no experience with the specified <paramref name="id"/> exists.</exception>
    public async Task<ExperienceDto> UpdateExperienceAsync(Guid id, ExperienceDto dto)
    {
        var experience = await _unitOfWork.Repository<Experience>().GetByIdAsync(id);
        if (experience == null)
            throw new KeyNotFoundException($"Experience with id {id} not found");

        ExperienceMapper.UpdateEntity(experience, dto);
        await _unitOfWork.CompleteAsync();
        return ExperienceMapper.ToDto(experience);
    }

    /// <summary>
    /// Deletes the experience with the specified identifier.
    /// </summary>
    /// <param name="id">The identifier of the experience to delete.</param>
    /// <returns>`true` if an experience with the given id was found and deleted, `false` otherwise.</returns>
    public async Task<bool> DeleteExperienceAsync(Guid id)
    {
        var experience = await _unitOfWork.Repository<Experience>().GetByIdAsync(id);
        if (experience == null)
            return false;

        _unitOfWork.Repository<Experience>().Delete(experience);
        await _unitOfWork.CompleteAsync();
        return true;
    }

    /// <summary>
    /// Extracts a four-digit year between 2000 and 2100 from a duration string.
    /// </summary>
    /// <param name="duration">Duration text to parse (for example "2019-2021" or "Jan 2020 / Present").</param>
    /// <returns>The first year found between 2000 and 2100, or 0 if no valid year is found.</returns>
    private int ExtractYear(string duration)
    {
        if (string.IsNullOrEmpty(duration)) return 0;
        
        var parts = duration.Split(new[] { '-', '/' }, StringSplitOptions.RemoveEmptyEntries);
        
        foreach (var part in parts)
        {
            var trimmed = part.Trim();
            if (int.TryParse(trimmed, out int year) && year >= 2000 && year <= 2100)
            {
                return year;
            }
            if (trimmed.Length >= 4)
            {
                var lastFour = trimmed.Substring(trimmed.Length - 4);
                if (int.TryParse(lastFour, out int yearFromEnd) && yearFromEnd >= 2000 && yearFromEnd <= 2100)
                {
                    return yearFromEnd;
                }
            }
        }
        
        return 0;
    }
}



