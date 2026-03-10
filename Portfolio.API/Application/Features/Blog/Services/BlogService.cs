using Microsoft.EntityFrameworkCore;
using Portfolio.API.Entities;
using Portfolio.API.Repositories;
using Portfolio.API.Application.Features.Blog.Mappers;
using Portfolio.API.Application.Features.Blog.DTOs;
using Portfolio.API.Application.Common;

namespace Portfolio.API.Application.Features.Blog.Services;

public class BlogService : IBlogService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<BlogService> _logger;
    private readonly MetadataExtractor _metadataExtractor;

    public BlogService(
        IUnitOfWork unitOfWork,
        ILogger<BlogService> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
        _metadataExtractor = new MetadataExtractor();
    }

    public async Task<List<BlogPostDto>> GetPostsAsync()
    {
        _logger.LogInformation("Fetching all blog posts");

        var posts = await _unitOfWork.Repository<BlogPost>()
            .Query()
            .OrderByDescending(p => p.PublishedAt)
            .ToListAsync();

        return posts.Select(BlogMapper.ToDto).ToList();
    }

    public async Task<BlogPostDto?> GetPostByIdAsync(Guid id)
    {
        _logger.LogInformation("Fetching blog post: {PostId}", id);

        var post = await _unitOfWork.Repository<BlogPost>()
            .GetByIdAsync(id);

        if (post == null)
        {
            _logger.LogWarning("Blog post not found: {PostId}", id);
            return null;
        }

        return BlogMapper.ToDto(post);
    }

    public async Task<BlogPostDto> CreatePostAsync(BlogPostDto dto)
    {
        _logger.LogInformation("Creating new blog post: {Title}", dto.Title);

        var post = new BlogPost
        {
            Id = Guid.NewGuid(),
            Title = dto.Title,
            Title_Ar = dto.Title_Ar,
            Summary = dto.Summary,
            Summary_Ar = dto.Summary_Ar,
            Content = dto.Content,
            Content_Ar = dto.Content_Ar,
            ImageUrl = dto.ImageUrl,
            SocialUrl = dto.SocialUrl,
            SocialType = dto.SocialType,
            PublishedAt = dto.PublishedAt,
            Tags = dto.Tags,
            Tags_Ar = dto.Tags_Ar,
            Author = dto.Author,
            LikesCount = dto.LikesCount,
            CommentsCount = dto.CommentsCount,
            StarsCount = dto.StarsCount,
            ForksCount = dto.ForksCount,
            Version = dto.Version,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _unitOfWork.Repository<BlogPost>().AddAsync(post);
        await _unitOfWork.CompleteAsync();

        _logger.LogInformation("Blog post created successfully: {PostId}", post.Id);
        return BlogMapper.ToDto(post);
    }

    public async Task<BlogPostDto> UpdatePostAsync(Guid id, BlogPostDto dto)
    {
        _logger.LogInformation("Updating blog post: {PostId}", id);

        var post = await _unitOfWork.Repository<BlogPost>()
            .GetByIdAsync(id);

        if (post == null)
        {
            throw new ArgumentException("Blog post not found");
        }

        BlogMapper.UpdateEntity(post, dto);
        post.UpdatedAt = DateTime.UtcNow;

        _unitOfWork.Repository<BlogPost>().Update(post);
        await _unitOfWork.CompleteAsync();

        _logger.LogInformation("Blog post updated successfully: {PostId}", id);
        return BlogMapper.ToDto(post);
    }

    public async Task DeletePostAsync(Guid id)
    {
        _logger.LogInformation("Deleting blog post: {PostId}", id);

        var post = await _unitOfWork.Repository<BlogPost>()
            .GetByIdAsync(id);

        if (post == null)
        {
            throw new ArgumentException("Blog post not found");
        }

        _unitOfWork.Repository<BlogPost>().Delete(post);
        await _unitOfWork.CompleteAsync();

        _logger.LogInformation("Blog post deleted successfully: {PostId}", id);
    }

    public async Task<BlogPostDto> ImportFromUrlAsync(string url)
    {
        _logger.LogInformation("Importing blog post from URL: {Url}", url);

        if (string.IsNullOrWhiteSpace(url))
        {
            throw new ArgumentException("URL cannot be empty");
        }

        var metadata = await _metadataExtractor.ExtractMetadata(url);

        var post = new BlogPost
        {
            Id = Guid.NewGuid(),
            Title = metadata.Title,
            Summary = metadata.Description,
            Content = metadata.Content,
            ImageUrl = metadata.ImageUrl,
            SocialUrl = url,
            SocialType = metadata.PlatformType,
            PublishedAt = metadata.PublishedDate ?? DateTime.UtcNow,
            Tags = metadata.Tags,
            Author = metadata.Author ?? "Mostafa Samir Said",
            Version = 1,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _unitOfWork.Repository<BlogPost>().AddAsync(post);
        await _unitOfWork.CompleteAsync();

        _logger.LogInformation("Blog post imported successfully: {PostId}", post.Id);
        return BlogMapper.ToDto(post);
    }
}



