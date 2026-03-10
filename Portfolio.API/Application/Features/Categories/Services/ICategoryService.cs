using Portfolio.API.Application.Features.Categories.DTOs;

namespace Portfolio.API.Application.Features.Categories.Services;

public interface ICategoryService
{
    Task<IEnumerable<CategoryDto>> GetCategoriesAsync();
    Task<CategoryDto?> GetCategoryByIdAsync(Guid id);
    Task<CategoryDto> CreateCategoryAsync(CategoryDto dto);
    Task<CategoryDto> UpdateCategoryAsync(Guid id, CategoryDto dto);
    Task DeleteCategoryAsync(Guid id);
}
