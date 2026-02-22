using Portfolio.API.Repositories;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BlogController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public BlogController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BlogPost>>> GetPosts()
    {
        var posts = await _unitOfWork.Repository<BlogPost>().GetAllAsync();
        return Ok(posts.OrderByDescending(b => b.PublishedAt));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<BlogPost>> GetPost(Guid id)
    {
        var post = await _unitOfWork.Repository<BlogPost>().GetByIdAsync(id);
        if (post == null) return NotFound();
        return post;
    }
}
