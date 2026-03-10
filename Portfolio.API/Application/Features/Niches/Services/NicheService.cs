using Microsoft.EntityFrameworkCore;
using Portfolio.API.Entities;
using Portfolio.API.Data;
using Portfolio.API.Application.Features.Niches.DTOs;
using Portfolio.API.Application.Features.Niches.Mappers;

namespace Portfolio.API.Application.Features.Niches.Services;

public class NicheService : INicheService
{
    private readonly PortfolioDbContext _context;

    public NicheService(PortfolioDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<NicheDto>> GetNichesAsync(CancellationToken cancellationToken = default)
    {
        var niches = await _context.Niches
            .OrderBy(n => n.Name)
            .ToListAsync(cancellationToken);
        return niches.Select(NicheMapper.ToDto);
    }

    public async Task<NicheDto?> GetNicheByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var niche = await _context.Niches.FindAsync(new object[] { id }, cancellationToken);
        return niche == null ? null : NicheMapper.ToDto(niche);
    }

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
    public async Task DeleteNicheAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var niche = await _context.Niches.FindAsync(new object[] { id }, cancellationToken);
        if (niche == null)
            throw new KeyNotFoundException($"Niche with id {id} not found");

        _context.Niches.Remove(niche);
        await _context.SaveChangesAsync(cancellationToken);
    }
}



