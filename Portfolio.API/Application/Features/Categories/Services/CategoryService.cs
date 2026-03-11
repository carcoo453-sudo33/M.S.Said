using Microsoft.EntityFrameworkCore;
using Portfolio.API.Entities;
using Portfolio.API.Data;
using Portfolio.API.Application.Features.Categories.DTOs;
using Portfolio.API.Application.Features.Categories.Mappers;

namespace Portfolio.API.Application.Features.Categories.Services;

public class CategoryService : ICategoryService
{
    private readonly PortfolioDbContext _context;

    /// <summary>
    /// Initializes a new instance of <see cref="CategoryService"/> with the specified database context.
    /// </summary>
    /// <param name="context">The <see cref="PortfolioDbContext"/> used to query and persist category data.</param>
    public CategoryService(PortfolioDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Retrieves all categories from the database ordered by Name and returns them as CategoryDto objects.
    /// </summary>
    /// <returns>An enumerable of CategoryDto representing all categories ordered by Name.</returns>
    public async Task<IEnumerable<CategoryDto>> GetCategoriesAsync(CancellationToken cancellationToken = default)
    {
        var categories = await _context.Categories
            .OrderBy(c => c.Name)
            .ToListAsync(cancellationToken);
        return categories.Select(CategoryMapper.ToDto);
    }

    /// <summary>
    /// Retrieve the category with the specified identifier and return its DTO representation, or null if not found.
    /// </summary>
    /// <param name="id">The unique identifier of the category to retrieve.</param>
    /// <returns>The <see cref="CategoryDto"/> for the specified identifier, or <c>null</c> if no matching category exists.</returns>
    public async Task<CategoryDto?> GetCategoryByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var category = await _context.Categories.FindAsync(new object[] { id }, cancellationToken);
        return category == null ? null : CategoryMapper.ToDto(category);
    }

    /// <summary>
    /// Creates a new category from the provided DTO after ensuring the category name is unique (case-insensitive).
    /// </summary>
    /// <param name="dto">Data transfer object containing the category name and localized name.</param>
    /// <returns>The created category as a <c>CategoryDto</c> with its generated Id populated.</returns>
    /// <exception cref="InvalidOperationException">Thrown when a category with the same name already exists.</exception>
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

    /// <summary>
    /// Updates the category with the specified id using values from the provided DTO.
    /// </summary>
    /// <param name="id">The identifier of the category to update.</param>
    /// <param name="dto">The DTO containing updated category values.</param>
    /// <returns>The updated category as a <see cref="CategoryDto"/>.</returns>
    /// <exception cref="KeyNotFoundException">Thrown if no category with the specified id exists.</exception>
    /// <exception cref="InvalidOperationException">Thrown if another category with the same name already exists.</exception>
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

    /// <summary>
    /// Deletes the category identified by the given id from the database.
    /// </summary>
    /// <param name="id">The identifier of the category to delete.</param>
    /// <exception cref="KeyNotFoundException">Thrown if no category exists with the provided id.</exception>
    public async Task DeleteCategoryAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var category = await _context.Categories.FindAsync(new object[] { id }, cancellationToken);
        if (category == null)
            throw new KeyNotFoundException($"Category with id {id} not found");

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync(cancellationToken);
    }
}



