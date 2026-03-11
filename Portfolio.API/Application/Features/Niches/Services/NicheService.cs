using Microsoft.EntityFrameworkCore;
using Portfolio.API.Entities;
using Portfolio.API.Data;
using Portfolio.API.Application.Features.Niches.DTOs;
using Portfolio.API.Application.Features.Niches.Mappers;

namespace Portfolio.API.Application.Features.Niches.Services;

public class NicheService : INicheService
{
    private readonly PortfolioDbContext _context;

    /// <summary>
    /// Initializes a new instance of <see cref="NicheService"/> using the provided <see cref="PortfolioDbContext"/> for data access.
    /// </summary>
    /// <param name="context">The database context used to access Niche entities.</param>
    public NicheService(PortfolioDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Retrieves all niches ordered by name and maps them to DTOs.
    /// </summary>
    /// <returns>An enumerable of NicheDto representing all niches sorted by Name.</returns>
    public async Task<IEnumerable<NicheDto>> GetNichesAsync(CancellationToken cancellationToken = default)
    {
        var niches = await _context.Niches
            .OrderBy(n => n.Name)
            .ToListAsync(cancellationToken);
        return niches.Select(NicheMapper.ToDto);
    }

    /// <summary>
    /// Retrieves the niche with the specified identifier.
    /// </summary>
    /// <param name="id">The niche identifier.</param>
    /// <param name="cancellationToken">Token to cancel the operation.</param>
    /// <returns>`NicheDto` for the niche with the specified identifier, or `null` if no matching niche is found.</returns>
    public async Task<NicheDto?> GetNicheByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var niche = await _context.Niches.FindAsync(new object[] { id }, cancellationToken);
        return niche == null ? null : NicheMapper.ToDto(niche);
    }

    /// <summary>
    /// Creates a new niche from the provided DTO and persists it to the database.
    /// </summary>
    /// <param name="dto">DTO containing the niche data to create (expects at least a Name; Name_Ar may be provided).</param>
    /// <returns>The created niche as a <see cref="NicheDto"/> including generated Id and CreatedAt timestamp.</returns>
    /// <exception cref="InvalidOperationException">Thrown when a niche with the same name already exists.</exception>
    public async Task<NicheDto> CreateNicheAsync(NicheDto dto, CancellationToken cancellationToken = default)
    {
        var exists = await _context.Niches
            .AnyAsync(n => EF.Functions.Collate(n.Name, "SQL_Latin1_General_CP1_CI_AS") == dto.Name, cancellationToken);
        if (exists)
            throw new InvalidOperationException("Niche with this name already exists");

        var niche = new Niche
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Name_Ar = dto.Name_Ar,
            CreatedAt = DateTime.UtcNow
        };

        _context.Niches.Add(niche);
        await _context.SaveChangesAsync(cancellationToken);
        return NicheMapper.ToDto(niche);
    }

    /// <summary>
    /// Updates an existing niche identified by <paramref name="id"/> using values from <paramref name="dto"/>.
    /// </summary>
    /// <param name="id">Identifier of the niche to update.</param>
    /// <param name="dto">DTO containing the updated niche values.</param>
    /// <param name="cancellationToken">Token to cancel the database operation.</param>
    /// <returns>The updated niche as a <see cref="NicheDto"/>.</returns>
    /// <exception cref="KeyNotFoundException">Thrown when no niche with the specified <paramref name="id"/> exists.</exception>
    /// <exception cref="InvalidOperationException">Thrown when another niche with the same name already exists.</exception>
    public async Task<NicheDto> UpdateNicheAsync(Guid id, NicheDto dto, CancellationToken cancellationToken = default)
    {
        var niche = await _context.Niches.FindAsync(new object[] { id }, cancellationToken);
        if (niche == null)
            throw new KeyNotFoundException($"Niche with id {id} not found");

        var exists = await _context.Niches
            .AnyAsync(n => EF.Functions.Collate(n.Name, "SQL_Latin1_General_CP1_CI_AS") == dto.Name && n.Id != id, cancellationToken);

        if (exists)
            throw new InvalidOperationException("Another niche with this name already exists");

        NicheMapper.UpdateEntity(niche, dto);
        await _context.SaveChangesAsync(cancellationToken);
        return NicheMapper.ToDto(niche);
    }
    /// <summary>
    /// Deletes the Niche with the specified id from the database.
    /// </summary>
    /// <param name="id">Identifier of the Niche to delete.</param>
    /// <exception cref="KeyNotFoundException">Thrown if a Niche with the specified id does not exist.</exception>
    public async Task DeleteNicheAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var niche = await _context.Niches.FindAsync(new object[] { id }, cancellationToken);
        if (niche == null)
            throw new KeyNotFoundException($"Niche with id {id} not found");

        _context.Niches.Remove(niche);
        await _context.SaveChangesAsync(cancellationToken);
    }
}



