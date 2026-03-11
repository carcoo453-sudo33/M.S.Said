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

<<<<<<< HEAD
=======
    /// <summary>
    /// Initializes a new instance of the <see cref="BlogController"/> class with the provided blog service.
    /// </summary>
    /// <param name="blogService">The service used to handle blog post operations.</param>
>>>>>>> origin/master
    public BlogController(IBlogService blogService)
    {
        _blogService = blogService;
    }

    /// <summary>
    /// Retrieves all blog posts.
    /// </summary>
    /// <returns>An enumerable of BlogPostDto containing all blog posts.</returns>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<BlogPostDto>>> GetPosts()
    {
        var posts = await _blogService.GetPostsAsync();
        return Ok(posts);
    }

    /// <summary>
    /// Retrieves the blog post with the specified identifier.
    /// </summary>
    /// <param name="id">The GUID of the blog post to retrieve.</param>
    /// <returns>An ActionResult containing the <see cref="BlogPostDto"/> when found, or a NotFound result if no post exists for the given id.</returns>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<BlogPostDto>> GetPost(Guid id)
    {
        var post = await _blogService.GetPostByIdAsync(id);
        if (post == null) return NotFound();
        return Ok(post);
    }

    /// <summary>
    /// Creates a new blog post from the provided DTO and returns the created resource.
    /// </summary>
    /// <param name="dto">Data transfer object containing the blog post fields to create.</param>
    /// <returns>The created <see cref="BlogPostDto"/> with its assigned identifier; response is 201 Created and includes a Location header for the new resource.</returns>
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<BlogPostDto>> CreatePost(BlogPostDto dto)
    {
        var result = await _blogService.CreatePostAsync(dto);
        return CreatedAtAction(nameof(GetPost), new { id = result.Id }, result);
    }

    /// <summary>
    /// Update an existing blog post identified by the given id using values from the provided DTO.
    /// </summary>
    /// <param name="id">The GUID of the blog post to update.</param>
    /// <param name="dto">The DTO containing the updated blog post fields.</param>
    /// <returns>HTTP 200 OK with the updated BlogPostDto.</returns>
    [Authorize]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdatePost(Guid id, BlogPostDto dto)
    {
<<<<<<< HEAD
        try
        {
            var result = await _blogService.UpdatePostAsync(id, dto);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return NotFound(ex.Message);
        }
=======
        var result = await _blogService.UpdatePostAsync(id, dto);
        return Ok(result);
>>>>>>> origin/master
    }

    /// <summary>
    /// Deletes the blog post identified by the specified id.
    /// </summary>
    /// <param name="id">The GUID of the blog post to delete.</param>
    /// <returns>`204 NoContent` if the post was deleted; `404 NotFound` if no post with the specified id exists.</returns>
    [Authorize]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeletePost(Guid id)
    {
        var deleted = await _blogService.DeletePostAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }

    /// <summary>
    /// Imports a blog post from the specified URL and returns the resulting post.
    /// </summary>
    /// <param name="request">Request containing the source URL to import the blog post from (see its Url property).</param>
    /// <returns>The imported BlogPostDto in an HTTP 200 OK response.</returns>
    [Authorize]
    [HttpPost("import-from-url")]
    public async Task<ActionResult<BlogPostDto>> ImportFromUrl([FromBody] ImportUrlRequest request)
    {
<<<<<<< HEAD
        try
        {
            var result = await _blogService.ImportFromUrlAsync(request.Url);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
=======
        var result = await _blogService.ImportFromUrlAsync(request.Url);
        return Ok(result);
>>>>>>> origin/master
    }
}
