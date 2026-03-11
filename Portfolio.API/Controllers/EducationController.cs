using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.API.Application.Features.Education.DTOs;
using Portfolio.API.Application.Features.Education.Services;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EducationController : ControllerBase
{
    private readonly IEducationService _educationService;

<<<<<<< HEAD
=======
    /// <summary>
    /// Initializes a new instance of the <see cref="EducationController"/> with the specified education service.
    /// </summary>
    /// <param name="educationService">Service used to perform education-related operations (retrieval, creation, update, deletion).</param>
>>>>>>> origin/master
    public EducationController(IEducationService educationService)
    {
        _educationService = educationService;
    }

    /// <summary>
    /// Retrieves all education records.
    /// </summary>
    /// <returns>An <see cref="IEnumerable{EducationDto}"/> containing all education records.</returns>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<EducationDto>>> GetEducation()
    {
        var education = await _educationService.GetEducationAsync();
<<<<<<< HEAD
        return Ok(education);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<EducationDto>> GetEducationById(Guid id)
    {
        var education = await _educationService.GetEducationByIdAsync(id);
        if (education == null) return NotFound();
=======
>>>>>>> origin/master
        return Ok(education);
    }

    /// <summary>
    /// Retrieves a specific education record by its unique identifier.
    /// </summary>
    /// <param name="id">The GUID identifying the education record to retrieve.</param>
    /// <returns>The matching <see cref="EducationDto"/> when found; otherwise a NotFound result.</returns>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<EducationDto>> GetEducationById(Guid id)
    {
        var education = await _educationService.GetEducationByIdAsync(id);
        if (education == null) return NotFound();
        return Ok(education);
    }

    /// <summary>
    /// Creates a new education record from the provided DTO.
    /// </summary>
    /// <param name="dto">The education data to create; the service assigns the resulting Id.</param>
    /// <returns>The created <see cref="EducationDto"/>; the response is 201 Created and includes a Location header for retrieving the new resource.</returns>
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<EducationDto>> CreateEducation(EducationDto dto)
    {
        var result = await _educationService.CreateEducationAsync(dto);
        return CreatedAtAction(nameof(GetEducationById), new { id = result.Id }, result);
    }

<<<<<<< HEAD
=======
    /// <summary>
    /// Updates an existing education record identified by the specified id.
    /// </summary>
    /// <param name="id">The identifier of the education record to update.</param>
    /// <param name="dto">The education data to apply to the record.</param>
    /// <returns>200 OK with the updated EducationDto if the record was updated; 404 NotFound if no record with the specified id exists.</returns>
>>>>>>> origin/master
    [Authorize]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateEducation(Guid id, EducationDto dto)
    {
        var result = await _educationService.UpdateEducationAsync(id, dto);
        if (result == null) return NotFound();
        return Ok(result);
    }
<<<<<<< HEAD
=======
    /// <summary>
    /// Deletes the education record identified by the provided GUID.
    /// </summary>
    /// <param name="id">The unique identifier of the education record to delete.</param>
    /// <returns>
    /// 204 No Content if the record was deleted; 404 Not Found if no record exists with the given identifier.
    /// </returns>
>>>>>>> origin/master
    [Authorize]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteEducation(Guid id)
    {
        var deleted = await _educationService.DeleteEducationAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }
}
