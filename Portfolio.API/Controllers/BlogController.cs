using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.API.Data;
using Portfolio.API.Entities;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BlogController : ControllerBase
{
    private readonly PortfolioDbContext _context;

    public BlogController(PortfolioDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BlogPost>>> GetPosts()
    {
        return await _context.BlogPosts
            .OrderByDescending(b => b.PublishedAt)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<BlogPost>> GetPost(Guid id)
    {
        var post = await _context.BlogPosts.FindAsync(id);
        if (post == null) return NotFound();
        return post;
    }
}
