using Portfolio.API.Entities;
using Portfolio.API.Repositories;
using Portfolio.API.Application.Features.Skills.DTOs;
using Portfolio.API.Application.Features.Skills.Mappers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace Portfolio.API.Application.Features.Skills.Services;

public class SkillService : ISkillService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMemoryCache _cache;

    /// <summary>
    /// Initializes a new instance of the SkillService class with the specified unit of work.
    /// </summary>
    public SkillService(IUnitOfWork unitOfWork, IMemoryCache cache)
    {
        _unitOfWork = unitOfWork;
        _cache = cache;
    }

    /// <summary>
    /// Retrieves all skills ordered by their Order property and maps each for external consumption.
    /// </summary>
    /// <returns>An enumerable of SkillDto objects ordered by the Skill.Order value.</returns>
    public async Task<IEnumerable<SkillDto>> GetSkillsAsync()
    {
        var cacheKey = "Skills_All";
        if (_cache.TryGetValue(cacheKey, out IEnumerable<SkillDto>? cachedSkills) && cachedSkills != null)
        {
            return cachedSkills;
        }

        var skills = await _unitOfWork.Repository<Skill>()
            .Query()
            .AsNoTracking()
            .ToListAsync();
            
        var result = skills.Select(SkillMapper.ToDto).ToList();

        _cache.Set(cacheKey, result, new MemoryCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(24)
        });

        return result;
    }

    /// <summary>
    /// Retrieve the skill with the specified identifier and map it to a SkillDto.
    /// </summary>
    /// <param name="id">The identifier of the skill to retrieve.</param>
    /// <returns>The mapped SkillDto if a skill with the specified id exists, or `null` if not found.</returns>
    public async Task<SkillDto?> GetSkillByIdAsync(Guid id)
    {
        var skill = await _unitOfWork.Repository<Skill>().GetByIdAsync(id);
        return skill == null ? null : SkillMapper.ToDto(skill);
    }

    /// <summary>
    /// Creates a new Skill from the provided DTO and persists it.
    /// </summary>
    /// <param name="dto">Skill data to create; if dto.Id is Guid.Empty a new Id will be generated.</param>
    /// <returns>The newly created Skill represented as a <see cref="SkillDto"/>.</returns>
    public async Task<SkillDto> CreateSkillAsync(SkillDto dto)
    {
        var skill = new Skill
        {
            // Always generate a new ID on the backend regardless of what the frontend sent
            Id = Guid.NewGuid(),
            Name = dto.Name,
            IconPath = dto.IconPath
        };
        await _unitOfWork.Repository<Skill>().AddAsync(skill);
        await _unitOfWork.CompleteAsync();
        
        _cache.Remove("Skills_All");
        
        return SkillMapper.ToDto(skill);
    }

    /// <summary>
    /// Update an existing Skill entity with values from the provided DTO and persist the change.
    /// </summary>
    /// <param name="id">Identifier of the Skill to update.</param>
    /// <param name="dto">DTO containing the updated Skill properties.</param>
    /// <returns>The updated Skill mapped to a <see cref="SkillDto"/>.</returns>
    /// <exception cref="KeyNotFoundException">Thrown when a Skill with the specified <paramref name="id"/> does not exist.</exception>
    public async Task<SkillDto> UpdateSkillAsync(Guid id, SkillDto dto)
    {
        var skill = await _unitOfWork.Repository<Skill>().GetByIdAsync(id);
        if (skill == null)
            throw new KeyNotFoundException($"Skill with id {id} not found");

        SkillMapper.UpdateEntity(skill, dto);
        await _unitOfWork.CompleteAsync();
        
        _cache.Remove("Skills_All");
        
        return SkillMapper.ToDto(skill);
    }

    /// <summary>
    /// Deletes the skill with the specified id if it exists.
    /// </summary>
    /// <param name="id">The identifier of the skill to delete.</param>
    /// <returns>`true` if a skill was found and deleted; `false` if no skill with the specified id exists.</returns>
    public async Task<bool> DeleteSkillAsync(Guid id)
    {
        var skill = await _unitOfWork.Repository<Skill>().GetByIdAsync(id);
        if (skill == null)
            return false;

        _unitOfWork.Repository<Skill>().Delete(skill);
        await _unitOfWork.CompleteAsync();
        
        _cache.Remove("Skills_All");
        
        return true;
    }
}



