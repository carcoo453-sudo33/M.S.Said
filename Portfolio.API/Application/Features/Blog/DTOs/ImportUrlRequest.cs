using Portfolio.API.Application.Common;

namespace Portfolio.API.Application.Features.Blog.DTOs;

/// <summary>
/// Blog import request - uses unified ImportRequest from Common
/// Supports: Medium, Dev.to, StackOverflow, LinkedIn, and generic blogs
/// </summary>
public static class ImportTypes
{
    public const string Blog = "Blog";
    // Add other types as needed
}

public class ImportUrlRequest : ImportRequest
{
    /// <summary>
    /// Initializes a new <see cref="ImportUrlRequest"/> and sets its <c>ImportType</c> to <see cref="ImportTypes.Blog"/>.
    /// </summary>
    public ImportUrlRequest()
    {
        ImportType = ImportTypes.Blog;
    }
}


