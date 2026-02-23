using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.API.Entities;
using Portfolio.API.Repositories;
using Portfolio.API.DTOs;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestimonialsController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public TestimonialsController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TestimonialEntry>>> GetTestimonials()
    {
        var testimonials = await _unitOfWork.Repository<TestimonialEntry>().GetAllAsync();
        return Ok(testimonials.OrderBy(t => t.Order));
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<TestimonialEntry>> CreateTestimonial(TestimonialDto dto)
    {
        var entry = new TestimonialEntry
        {
            Id = dto.Id != Guid.Empty ? dto.Id : Guid.NewGuid(),
            Name = dto.Name,
            Role = dto.Role,
            Content = dto.Content,
            Company = dto.Company,
            AvatarUrl = dto.AvatarUrl,
            Order = dto.Order,
            IsFeatured = dto.IsFeatured
        };
        await _unitOfWork.Repository<TestimonialEntry>().AddAsync(entry);
        await _unitOfWork.CompleteAsync();
        return CreatedAtAction(nameof(GetTestimonials), new { id = entry.Id }, entry);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTestimonial(Guid id, TestimonialDto dto)
    {
        var repository = _unitOfWork.Repository<TestimonialEntry>();
        var testimonial = await repository.GetByIdAsync(id);
        
        if (testimonial == null) return NotFound();

        testimonial.Name = dto.Name;
        testimonial.Role = dto.Role;
        testimonial.Content = dto.Content;
        testimonial.Company = dto.Company;
        testimonial.AvatarUrl = dto.AvatarUrl;
        testimonial.Order = dto.Order;
        testimonial.IsFeatured = dto.IsFeatured;
        testimonial.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.CompleteAsync();
        return Ok(testimonial);
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTestimonial(Guid id)
    {
        var entry = await _unitOfWork.Repository<TestimonialEntry>().GetByIdAsync(id);
        if (entry == null) return NotFound();
        _unitOfWork.Repository<TestimonialEntry>().Delete(entry);
        await _unitOfWork.CompleteAsync();
        return NoContent();
    }
}
