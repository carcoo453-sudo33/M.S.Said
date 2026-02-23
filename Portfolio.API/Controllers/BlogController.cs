using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.API.Entities;
using Portfolio.API.Repositories;
using Portfolio.API.DTOs;

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

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<BlogPost>> GetPost(Guid id)
    {
        var post = await _unitOfWork.Repository<BlogPost>().GetByIdAsync(id);
        if (post == null) return NotFound();
        return Ok(post);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<BlogPost>> CreatePost(BlogPostDto dto)
    {
        var entry = new BlogPost
        {
            Id = dto.Id != Guid.Empty ? dto.Id : Guid.NewGuid(),
            Title = dto.Title,
            Summary = dto.Summary,
            Content = dto.Content,
            ImageUrl = dto.ImageUrl,
            SocialUrl = dto.SocialUrl,
            SocialType = dto.SocialType,
            PublishedAt = dto.PublishedAt != default ? dto.PublishedAt : DateTime.UtcNow,
            Tags = dto.Tags,
            Author = dto.Author,
            LikesCount = dto.LikesCount,
            CommentsCount = dto.CommentsCount,
            StarsCount = dto.StarsCount,
            ForksCount = dto.ForksCount,
            Version = dto.Version
        };
        await _unitOfWork.Repository<BlogPost>().AddAsync(entry);
        await _unitOfWork.CompleteAsync();
        return CreatedAtAction(nameof(GetPost), new { id = entry.Id }, entry);
    }

    [Authorize]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdatePost(Guid id, BlogPostDto dto)
    {
        var repository = _unitOfWork.Repository<BlogPost>();
        var post = await repository.GetByIdAsync(id);
        
        if (post == null) return NotFound();

        post.Title = dto.Title;
        post.Summary = dto.Summary;
        post.Content = dto.Content;
        post.ImageUrl = dto.ImageUrl;
        post.SocialUrl = dto.SocialUrl;
        post.SocialType = dto.SocialType;
        post.PublishedAt = dto.PublishedAt != default ? dto.PublishedAt : post.PublishedAt;
        post.Tags = dto.Tags;
        post.Author = dto.Author;
        post.LikesCount = dto.LikesCount;
        post.CommentsCount = dto.CommentsCount;
        post.StarsCount = dto.StarsCount;
        post.ForksCount = dto.ForksCount;
        post.Version = dto.Version;
        post.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.CompleteAsync();
        return Ok(post);
    }

    [Authorize]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeletePost(Guid id)
    {
        var entry = await _unitOfWork.Repository<BlogPost>().GetByIdAsync(id);
        if (entry == null) return NotFound();
        _unitOfWork.Repository<BlogPost>().Delete(entry);
        await _unitOfWork.CompleteAsync();
        return NoContent();
    }
}
