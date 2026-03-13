using Microsoft.EntityFrameworkCore;
using Portfolio.API.Entities;
using Portfolio.API.Repositories;
using Portfolio.API.Application.Features.Blog.Mappers;
using Portfolio.API.Application.Features.Blog.DTOs;
using Portfolio.API.Application.Common;
using Microsoft.Extensions.Caching.Memory;

namespace Portfolio.API.Application.Features.Blog.Services;

public class BlogService : IBlogService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMemoryCache _cache;
    private readonly ILogger<BlogService> _logger;
    private readonly MetadataExtractor _metadataExtractor;

    /// <summary>
    /// Initializes a new instance of the BlogService class with the specified unit of work and logger and creates a MetadataExtractor.
    /// </summary>
    public BlogService(
        IUnitOfWork unitOfWork,
        IMemoryCache cache,
        ILogger<BlogService> logger)
    {
        _unitOfWork = unitOfWork;
        _cache = cache;
        _logger = logger;
        _metadataExtractor = new MetadataExtractor();
    }

    /// <summary>
    /// Retrieve all blog posts ordered by published date, newest first, with optional pagination.
    /// </summary>
    /// <param name="page">Page number (1-based). Default is 1.</param>
    /// <param name="pageSize">Number of posts per page. Default is 10.</param>
    /// <returns>A PagedResult containing BlogPostDto items, ordered by PublishedAt descending.</returns>
    public async Task<PagedResult<BlogPostDto>> GetPostsAsync(int page = 1, int pageSize = 10)
    {
        var cacheKey = $"BlogPosts_Page{page}_Size{pageSize}";
        if (_cache.TryGetValue(cacheKey, out PagedResult<BlogPostDto>? cachedResult) && cachedResult != null)
        {
            return cachedResult;
        }

        _logger.LogInformation("Fetching blog posts from database - Page: {Page}, PageSize: {PageSize}", page, pageSize);

        var query = _unitOfWork.Repository<BlogPost>()
            .Query()
            .AsNoTracking()
            .OrderByDescending(p => p.PublishedAt);

        var totalCount = await query.CountAsync();
        
        var posts = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var result = new PagedResult<BlogPostDto>
        {
            Items = posts.Select(BlogMapper.ToDto).ToList(),
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };

        _cache.Set(cacheKey, result, new MemoryCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
        });

        return result;
    }

    /// <summary>
    /// Retrieve a blog post by its identifier.
    /// </summary>
    /// <param name="id">The identifier of the blog post to retrieve.</param>
    /// <returns>The mapped BlogPostDto for the specified post, or null if no post exists with the given identifier.</returns>
    public async Task<BlogPostDto?> GetPostByIdAsync(Guid id)
    {
        _logger.LogInformation("Fetching blog post: {PostId}", id);

        var post = await _unitOfWork.Repository<BlogPost>()
            .Query()
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id);

        if (post == null)
        {
            _logger.LogWarning("Blog post not found: {PostId}", id);
            return null;
        }

        return BlogMapper.ToDto(post);
    }

    /// <summary>
    /// Creates a new blog post from the provided DTO and persists it to the data store.
    /// </summary>
    /// <param name="dto">The DTO containing values for the new blog post.</param>
    /// <returns>The created blog post represented as a <see cref="BlogPostDto"/>.</returns>
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

    /// <summary>
    /// Update the blog post with the given id using values from the provided DTO.
    /// </summary>
    /// <param name="id">The identifier of the blog post to update.</param>
    /// <param name="dto">A DTO containing the updated values to apply to the post.</param>
    /// <returns>The updated BlogPostDto.</returns>
    /// <exception cref="ArgumentException">Thrown when a blog post with the specified id does not exist.</exception>
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

    /// <summary>
    /// Deletes the blog post with the specified identifier if it exists.
    /// </summary>
    /// <param name="id">The identifier of the blog post to delete.</param>
    /// <returns>`true` if the post was found and deleted, `false` otherwise.</returns>
    public async Task<bool> DeletePostAsync(Guid id)
    {
        _logger.LogInformation("Deleting blog post: {PostId}", id);

        var post = await _unitOfWork.Repository<BlogPost>()
            .GetByIdAsync(id);

        if (post == null)
        {
            _logger.LogWarning("Blog post not found: {PostId}", id);
            return false;
        }

        _unitOfWork.Repository<BlogPost>().Delete(post);
        await _unitOfWork.CompleteAsync();

        _logger.LogInformation("Blog post deleted successfully: {PostId}", id);
        return true;
    }

    /// <summary>
    /// Imports a blog post from the specified web URL into the datastore.
    /// </summary>
    /// <param name="url">The web URL to extract metadata and create the blog post from.</param>
    /// <returns>The created BlogPostDto representing the imported post.</returns>
    /// <exception cref="System.ArgumentException">Thrown when <paramref name="url"/> is null, empty, or whitespace.</exception>
    public async Task<BlogPostDto> ImportFromUrlAsync(string url)
    {
        _logger.LogInformation("Extracting metadata for blog post import: {Url}", url);

        if (string.IsNullOrWhiteSpace(url))
        {
            throw new ArgumentException("URL cannot be empty");
        }

        var metadata = await _metadataExtractor.ExtractMetadata(url);

        // We return a DTO for preview in the UI. 
        // We do NOT save it to the database here to allow the user to review and edit.
        return new BlogPostDto
        {
            Id = Guid.Empty, // Indicates it's not yet in the DB
            Title = metadata.Title,
            Summary = metadata.Description ?? string.Empty,
            Content = metadata.Content ?? string.Empty,
            ImageUrl = metadata.ImageUrl ?? string.Empty,
            SocialUrl = url,
            SocialType = metadata.PlatformType,
            PublishedAt = metadata.PublishedDate ?? DateTime.UtcNow,
            Tags = metadata.Tags ?? string.Empty,
            Author = metadata.Author ?? "Mostafa Samir Said",
            Version = "1"
        };
    }
}



