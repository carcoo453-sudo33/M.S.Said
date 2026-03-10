using Portfolio.API.Application.Features.Blog.DTOs;

namespace Portfolio.API.Application.Features.Blog.Services;

public interface IBlogService
{
    Task<List<BlogPostDto>> GetPostsAsync();
    Task<BlogPostDto?> GetPostByIdAsync(Guid id);
    Task<BlogPostDto> CreatePostAsync(BlogPostDto dto);
    Task<BlogPostDto> UpdatePostAsync(Guid id, BlogPostDto dto);
    Task DeletePostAsync(Guid id);
    Task<BlogPostDto> ImportFromUrlAsync(string url);
}
