using Portfolio.API.Application.Common;

namespace Portfolio.API.Application.Features.Blog.DTOs;

/// <summary>
/// Blog import request - uses unified ImportRequest from Common
/// Supports: Medium, Dev.to, StackOverflow, LinkedIn, and generic blogs
/// </summary>
public class ImportUrlRequest : ImportRequest
{
    public ImportUrlRequest()
    {
        ImportType = "Blog"; // Default to Blog for blog feature
    }
}



