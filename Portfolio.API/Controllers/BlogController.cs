using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.API.Application.Features.Blog.DTOs;
using Portfolio.API.Application.Features.Blog.Services;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BlogController : ControllerBase
{
    private readonly IBlogService _blogService;

    public BlogController(IBlogService blogService)
    {
        _blogService = blogService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BlogPostDto>>> GetPosts()
    {
        var posts = await _blogService.GetPostsAsync();
        return Ok(posts);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<BlogPostDto>> GetPost(Guid id)
    {
        var post = await _blogService.GetPostByIdAsync(id);
        if (post == null) return NotFound();
        return Ok(post);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<BlogPostDto>> CreatePost(BlogPostDto dto)
    {
        var result = await _blogService.CreatePostAsync(dto);
        return CreatedAtAction(nameof(GetPost), new { id = result.Id }, result);
    }

    [Authorize]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdatePost(Guid id, BlogPostDto dto)
    {
        var result = await _blogService.UpdatePostAsync(id, dto);
        return Ok(result);
    }

    [Authorize]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeletePost(Guid id)
    {
        var deleted = await _blogService.DeletePostAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }

    [Authorize]
    [HttpPost("import-from-url")]
    public async Task<ActionResult<BlogPostDto>> ImportFromUrl([FromBody] ImportUrlRequest request)
    {
        var result = await _blogService.ImportFromUrlAsync(request.Url);
        return Ok(result);
    }
}
