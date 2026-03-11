using Portfolio.API.Application.Common;

namespace Portfolio.API.Application.Features.Projects.DTOs;

/// <summary>
/// Project import request - uses unified ImportRequest from Common
/// Primarily for GitHub repository imports
/// </summary>
public class GitHubImportDto : ImportRequest
{
<<<<<<< HEAD
=======
    /// <summary>
    /// Initializes a new instance of <see cref="GitHubImportDto"/> and sets the <c>ImportType</c> property to "GitHub".
    /// </summary>
>>>>>>> origin/master
    public GitHubImportDto()
    {
        ImportType = "GitHub"; // Default to GitHub for projects feature
    }
}



