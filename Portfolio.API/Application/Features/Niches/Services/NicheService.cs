using Microsoft.EntityFrameworkCore;
using Portfolio.API.Entities;
using Portfolio.API.Infrastructure.Data;
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

    public async Task<IEnumerable<NicheDto>> GetNichesAsync()
    {
        var niches = await _context.Niches
            .OrderBy(n => n.Name)
            .ToListAsync();
        return niches.Select(NicheMapper.ToDto);
    }

    public async Task<NicheDto?> GetNicheByIdAsync(Guid id)
    {
        var niche = await _context.Niches.FindAsync(id);
        return niche == null ? null : NicheMapper.ToDto(niche);
    }

    public async Task<NicheDto> CreateNicheAsync(NicheDto dto)
    {
        var exists = await _context.Niches
            .AnyAsync(n => n.Name.ToLower() == dto.Name.ToLower());

        if (exists)
            throw new InvalidOperationException("Niche with this name already exists");

        var niche = new Niche
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Name_Ar = dto.Name_Ar
        };

        _context.Niches.Add(niche);
        await _context.SaveChangesAsync();
        return NicheMapper.ToDto(niche);
    }

    public async Task<NicheDto> UpdateNicheAsync(Guid id, NicheDto dto)
    {
        var niche = await _context.Niches.FindAsync(id);
        if (niche == null)
            throw new KeyNotFoundException($"Niche with id {id} not found");

        var exists = await _context.Niches
            .AnyAsync(n => n.Name.ToLower() == dto.Name.ToLower() && n.Id != id);

        if (exists)
            throw new InvalidOperationException("Another niche with this name already exists");

        NicheMapper.UpdateEntity(niche, dto);
        await _context.SaveChangesAsync();
        return NicheMapper.ToDto(niche);
    }

    public async Task DeleteNicheAsync(Guid id)
    {
        var niche = await _context.Niches.FindAsync(id);
        if (niche == null)
            throw new KeyNotFoundException($"Niche with id {id} not found");

        _context.Niches.Remove(niche);
        await _context.SaveChangesAsync();
    }
}
