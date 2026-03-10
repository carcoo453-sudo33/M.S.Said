using Microsoft.EntityFrameworkCore;
using Portfolio.API.Entities;
using Portfolio.API.Data;
using Portfolio.API.Application.Features.Categories.DTOs;
using Portfolio.API.Application.Features.Categories.Mappers;

namespace Portfolio.API.Application.Features.Categories.Services;

public class CategoryService : ICategoryService
{
    private readonly PortfolioDbContext _context;

    public CategoryService(PortfolioDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<CategoryDto>> GetCategoriesAsync(CancellationToken cancellationToken = default)
    {
        var categories = await _context.Categories
            .OrderBy(c => c.Name)
            .ToListAsync(cancellationToken);
        return categories.Select(CategoryMapper.ToDto);
    }

    public async Task<CategoryDto?> GetCategoryByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var category = await _context.Categories.FindAsync(new object[] { id }, cancellationToken);
        return category == null ? null : CategoryMapper.ToDto(category);
    }

    public async Task<CategoryDto> CreateCategoryAsync(CategoryDto dto, CancellationToken cancellationToken = default)
    {
        var exists = await _context.Categories
            .AnyAsync(c => EF.Functions.Collate(c.Name, "SQL_Latin1_General_CP1_CI_AS") == dto.Name, cancellationToken);
        if (exists)
            throw new InvalidOperationException("Category with this name already exists");

        var category = new Category
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Name_Ar = dto.Name_Ar
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync(cancellationToken);
        return CategoryMapper.ToDto(category);
    }

    public async Task<CategoryDto> UpdateCategoryAsync(Guid id, CategoryDto dto, CancellationToken cancellationToken = default)
    {
        var category = await _context.Categories.FindAsync(new object[] { id }, cancellationToken);
        if (category == null)
            throw new KeyNotFoundException($"Category with id {id} not found");

        var exists = await _context.Categories
            .AnyAsync(c => EF.Functions.Collate(c.Name, "SQL_Latin1_General_CP1_CI_AS") == dto.Name && c.Id != id, cancellationToken);

        if (exists)
            throw new InvalidOperationException("Another category with this name already exists");

        CategoryMapper.UpdateEntity(category, dto);
        await _context.SaveChangesAsync(cancellationToken);
        return CategoryMapper.ToDto(category);
    }

    public async Task DeleteCategoryAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var category = await _context.Categories.FindAsync(new object[] { id }, cancellationToken);
        if (category == null)
            throw new KeyNotFoundException($"Category with id {id} not found");

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync(cancellationToken);
    }
}



