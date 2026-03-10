using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UploadsController : ControllerBase
{
    private readonly IWebHostEnvironment _environment;

    public UploadsController(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    [Authorize]
    [HttpPost("profile-image")]
    public async Task<IActionResult> UploadProfileImage(IFormFile file)
    {
        return await ProcessFileUpload(file, "uploads/avatars");
    }

    [Authorize]
    [HttpPost("cv")]
    public async Task<IActionResult> UploadCV(IFormFile file)
    {
        return await ProcessFileUpload(file, "uploads/cvs");
    }

    [Authorize]
    [HttpPost("skill-icon")]
    public async Task<IActionResult> UploadSkillIcon(IFormFile file)
    {
        return await ProcessFileUpload(file, "uploads/skills");
    }

    [Authorize]
    [HttpPost("project-image")]
    public async Task<IActionResult> UploadProjectImage(IFormFile file)
    {
        return await ProcessFileUpload(file, "uploads/projects");
    }

    private async Task<IActionResult> ProcessFileUpload(IFormFile file, string subFolder)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded.");

        const long maxFileSize = 5 * 1024 * 1024; // 5MB
        if (file.Length > maxFileSize)
            return BadRequest("File size exceeds the 5MB limit.");

        var allowedExtensions = subFolder switch
        {
            "uploads/avatars" => new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" },
            "uploads/cvs" => new[] { ".pdf", ".doc", ".docx" },
            "uploads/skills" => new[] { ".svg", ".png", ".jpg", ".jpeg" },
            "uploads/projects" => new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" },
            _ => Array.Empty<string>()
        };

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(extension))
            return BadRequest($"File type '{extension}' is not allowed for this upload type.");

        // Robust path resolution: if WebRootPath is null (common in some run scenarios),
        // use ContentRootPath and append wwwroot.
        var webRoot = _environment.WebRootPath;
        if (string.IsNullOrEmpty(webRoot))
        {
            webRoot = Path.Combine(_environment.ContentRootPath, "wwwroot");
        }

        var uploadsFolder = Path.Combine(webRoot, subFolder);
        if (!Directory.Exists(uploadsFolder))
            Directory.CreateDirectory(uploadsFolder);

        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        var filePath = Path.Combine(uploadsFolder, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // Always return a path starting with / for consistency in the UI
        var relativePath = $"/{subFolder}/{fileName}";
        return Ok(new { url = relativePath });
    }    
}

