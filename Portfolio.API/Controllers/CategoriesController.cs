using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.API.Application.Features.Categories.DTOs;
using Portfolio.API.Application.Features.Categories.Services;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    /// <summary>
    /// Initializes a new instance of <see cref="CategoriesController"/> with the provided category service.
    /// </summary>
    /// <param name="categoryService">Service used to perform category operations (retrieval, creation, update, deletion).</param>
    public CategoriesController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    /// <summary>
    /// Retrieves all categories.
    /// </summary>
    /// <returns>An ActionResult containing the collection of CategoryDto objects; on success returns 200 OK with the list.</returns>
    [HttpGet]
    [ResponseCache(Duration = 300, Location = ResponseCacheLocation.Any)] // Cache for 5 minutes
    public async Task<ActionResult<IEnumerable<CategoryDto>>> GetAll()
    {
        var categories = await _categoryService.GetCategoriesAsync();
        return Ok(categories);
    }

    /// <summary>
    /// Retrieves a category by its identifier.
    /// </summary>
    /// <param name="id">The GUID of the category to retrieve.</param>
    /// <returns>The requested <see cref="CategoryDto"/> if found; otherwise a 404 NotFound result.</returns>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<CategoryDto>> GetById(Guid id)
    {
        var category = await _categoryService.GetCategoryByIdAsync(id);
        if (category == null) return NotFound();
        return Ok(category);
    }

    /// <summary>
    /// Creates a new category.
    /// </summary>
    /// <param name="dto">The category data to create.</param>
    /// <returns>An ActionResult containing the created <see cref="CategoryDto"/> and a Location header referencing the newly created resource.</returns>
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<CategoryDto>> Create(CategoryDto dto)
    {
        var result = await _categoryService.CreateCategoryAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    /// <summary>
    /// Updates an existing category identified by the provided ID.
    /// </summary>
    /// <param name="id">The GUID of the category to update.</param>
    /// <param name="dto">The category data to apply to the existing category.</param>
    /// <returns>200 OK with the updated CategoryDto when the category exists; 404 NotFound if no category with the specified ID is found.</returns>
    [Authorize]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, CategoryDto dto)
    {
        var existing = await _categoryService.GetCategoryByIdAsync(id);
        if (existing == null) return NotFound();
        
        var result = await _categoryService.UpdateCategoryAsync(id, dto);
        return Ok(result);
    }
    /// <summary>
    /// Deletes the category identified by the specified GUID.
    /// </summary>
    /// <param name="id">The GUID of the category to delete.</param>
    /// <returns>204 No Content if the category was deleted; 404 Not Found if no category exists with the provided id.</returns>
    [Authorize]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            await _categoryService.DeleteCategoryAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }
}
