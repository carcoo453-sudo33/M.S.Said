using Portfolio.API.Application.Features.Categories.DTOs;

namespace Portfolio.API.Application.Features.Categories.Services;

public interface ICategoryService
{
    /// <summary>
/// Retrieves all categories.
/// </summary>
/// <param name="cancellationToken">Token to cancel the operation.</param>
/// <returns>A collection of CategoryDto representing all categories.</returns>
Task<IEnumerable<CategoryDto>> GetCategoriesAsync(CancellationToken cancellationToken = default);
    /// <summary>
/// Retrieve a category by its unique identifier.
/// </summary>
/// <param name="id">The GUID of the category to retrieve.</param>
/// <returns>The matching <see cref="CategoryDto"/> if found, or <c>null</c> if no category exists with the specified id.</returns>
Task<CategoryDto?> GetCategoryByIdAsync(Guid id, CancellationToken cancellationToken = default);
    /// <summary>
/// Creates a new category from the provided DTO and returns the created representation.
/// </summary>
/// <param name="dto">The category data to create; fields may be populated or augmented by the server.</param>
/// <returns>The created CategoryDto, including any generated identifier or server-populated fields.</returns>
Task<CategoryDto> CreateCategoryAsync(CategoryDto dto, CancellationToken cancellationToken = default);
    /// <summary>
/// Update an existing category identified by the provided GUID using values from the given DTO.
/// </summary>
/// <param name="id">The GUID of the category to update.</param>
/// <param name="dto">A data transfer object containing the updated category details.</param>
/// <returns>The updated CategoryDto.</returns>
Task<CategoryDto> UpdateCategoryAsync(Guid id, CategoryDto dto, CancellationToken cancellationToken = default);
    /// <summary>
/// Deletes the category with the specified unique identifier.
/// </summary>
/// <param name="id">The GUID of the category to delete.</param>
Task DeleteCategoryAsync(Guid id, CancellationToken cancellationToken = default);
}


