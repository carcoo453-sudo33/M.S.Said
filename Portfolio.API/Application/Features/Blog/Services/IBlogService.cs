using Portfolio.API.Application.Features.Blog.DTOs;

namespace Portfolio.API.Application.Features.Blog.Services;

public interface IBlogService
{
    /// <summary>
/// Retrieves all blog posts.
/// </summary>
/// <returns>A list of BlogPostDto objects representing all blog posts.</returns>
Task<List<BlogPostDto>> GetPostsAsync();
    /// <summary>
/// Get a blog post by its identifier.
/// </summary>
/// <param name="id">The unique identifier of the blog post.</param>
/// <returns>The matching <see cref="BlogPostDto"/> if found, or <c>null</c> if no post exists with the specified id.</returns>
Task<BlogPostDto?> GetPostByIdAsync(Guid id);
    /// <summary>
/// Creates a new blog post from the provided DTO.
/// </summary>
/// <param name="dto">The blog post data to create.</param>
/// <returns>The created BlogPostDto with server-assigned values (for example, Id or timestamps) populated.</returns>
Task<BlogPostDto> CreatePostAsync(BlogPostDto dto);
    /// <summary>
/// Updates an existing blog post identified by the given id using values from the provided DTO.
/// </summary>
/// <param name="id">The unique identifier of the blog post to update.</param>
/// <param name="dto">A DTO containing the updated values for the blog post.</param>
/// <returns>The updated BlogPostDto.</returns>
Task<BlogPostDto> UpdatePostAsync(Guid id, BlogPostDto dto);
    /// <summary>
/// Deletes the blog post identified by the specified id.
/// </summary>
/// <param name="id">The unique identifier of the blog post to delete.</param>
/// <returns>`true` if the post was deleted, `false` otherwise.</returns>
Task<bool> DeletePostAsync(Guid id);
    /// <summary>
/// Imports a blog post from the specified URL and returns the created blog post DTO.
/// </summary>
/// <param name="url">The HTTP or HTTPS URL of the external blog post to import.</param>
/// <returns>The created BlogPostDto representing the imported post.</returns>
Task<BlogPostDto> ImportFromUrlAsync(string url);
}



