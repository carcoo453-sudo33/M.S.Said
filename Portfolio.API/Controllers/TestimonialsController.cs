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
    public async Task<ActionResult<IEnumerable<Testimonial>>> GetTestimonials()
    {
        var testimonials = await _unitOfWork.Repository<Testimonial>().GetAllAsync();
        return Ok(testimonials.OrderBy(t => t.Order));
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<Testimonial>> CreateTestimonial(TestimonialDto dto)
    {
        var entry = new Testimonial
        {
            Id = dto.Id != Guid.Empty ? dto.Id : Guid.NewGuid(),
            Name = dto.Name,
            Role = dto.Role,
            Role_Ar = dto.Role_Ar,
            Content = dto.Content,
            Content_Ar = dto.Content_Ar,
            Company = dto.Company,
            Company_Ar = dto.Company_Ar,
            AvatarUrl = dto.AvatarUrl,
            Order = dto.Order,
            IsFeatured = dto.IsFeatured
        };
        await _unitOfWork.Repository<Testimonial>().AddAsync(entry);
        await _unitOfWork.CompleteAsync();
        return CreatedAtAction(nameof(GetTestimonials), new { id = entry.Id }, entry);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTestimonial(Guid id, TestimonialDto dto)
    {
        var repository = _unitOfWork.Repository<Testimonial>();
        var testimonial = await repository.GetByIdAsync(id);
        
        if (testimonial == null) return NotFound();

        testimonial.Name = dto.Name;
        testimonial.Role = dto.Role;
        testimonial.Role_Ar = dto.Role_Ar;
        testimonial.Content = dto.Content;
        testimonial.Content_Ar = dto.Content_Ar;
        testimonial.Company = dto.Company;
        testimonial.Company_Ar = dto.Company_Ar;
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
        var entry = await _unitOfWork.Repository<Testimonial>().GetByIdAsync(id);
        if (entry == null) return NotFound();
        _unitOfWork.Repository<Testimonial>().Delete(entry);
        await _unitOfWork.CompleteAsync();
        return NoContent();
    }
}
