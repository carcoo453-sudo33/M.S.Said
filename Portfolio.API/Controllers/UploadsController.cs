using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UploadsController : ControllerBase
{
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<UploadsController> _logger;

    // Magic bytes (file signatures) for allowed types
    private static readonly Dictionary<string, byte[][]> MagicBytes = new()
    {
        [".jpg"]  = [new byte[] { 0xFF, 0xD8, 0xFF }],
        [".jpeg"] = [new byte[] { 0xFF, 0xD8, 0xFF }],
        [".png"]  = [new byte[] { 0x89, 0x50, 0x4E, 0x47 }],
        [".gif"]  = [new byte[] { 0x47, 0x49, 0x46, 0x38 }],
        [".webp"] = [new byte[] { 0x52, 0x49, 0x46, 0x46 }],
        [".pdf"]  = [new byte[] { 0x25, 0x50, 0x44, 0x46 }],
        // Word docs (.doc/.docx) use OLE/ZIP magic — check both
        [".doc"]  = [new byte[] { 0xD0, 0xCF, 0x11, 0xE0 }],
        [".docx"] = [new byte[] { 0x50, 0x4B, 0x03, 0x04 }],
        // SVG is XML text — no magic bytes, validate by content
        [".svg"]  = [],
    };

    // Per-endpoint allowed extensions and max sizes
    private static readonly FileUploadPolicy ProfileImagePolicy = new(
        [".jpg", ".jpeg", ".png", ".webp"],
        MaxBytes: 5 * 1024 * 1024 // 5 MB
    );
    private static readonly FileUploadPolicy CvPolicy = new(
        [".pdf", ".doc", ".docx"],
        MaxBytes: 10 * 1024 * 1024 // 10 MB
    );
    private static readonly FileUploadPolicy SkillIconPolicy = new(
        [".png", ".jpg", ".jpeg", ".webp"],
        MaxBytes: 2 * 1024 * 1024 // 2 MB — SVG removed (active content risk)
    );
    private static readonly FileUploadPolicy ProjectImagePolicy = new(
        [".jpg", ".jpeg", ".png", ".webp"],
        MaxBytes: 5 * 1024 * 1024 // 5 MB
    );

    public UploadsController(IWebHostEnvironment environment, ILogger<UploadsController> logger)
    {
        _environment = environment;
        _logger = logger;
    }

    [Authorize]
    [HttpPost("profile-image")]
    public async Task<IActionResult> UploadProfileImage(IFormFile file)
        => await ProcessFileUpload(file, "avatars", ProfileImagePolicy);

    [Authorize]
    [HttpPost("cv")]
    public async Task<IActionResult> UploadCV(IFormFile file)
        => await ProcessFileUpload(file, "cvs", CvPolicy);

    [Authorize]
    [HttpPost("skill-icon")]
    public async Task<IActionResult> UploadSkillIcon(IFormFile file)
        => await ProcessFileUpload(file, "skills", SkillIconPolicy);

    [Authorize]
    [HttpPost("project-image")]
    public async Task<IActionResult> UploadProjectImage(IFormFile file)
        => await ProcessFileUpload(file, "projects", ProjectImagePolicy);

    /// <summary>
    /// Serves files from the secure uploads directory (outside wwwroot).
    /// </summary>
    [HttpGet("{category}/{fileName}")]
    public IActionResult ServeFile(string category, string fileName)
    {
        // Sanitize: only allow safe path segments
        if (category.Contains("..") || fileName.Contains(".."))
            return BadRequest();

        var uploadsRoot = GetUploadsRoot();
        var filePath = Path.Combine(uploadsRoot, category, fileName);

        if (!System.IO.File.Exists(filePath))
            return NotFound();

        var ext = Path.GetExtension(fileName).ToLowerInvariant();
        var contentType = ext switch
        {
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png"            => "image/png",
            ".webp"           => "image/webp",
            ".gif"            => "image/gif",
            ".pdf"            => "application/pdf",
            ".doc"            => "application/msword",
            ".docx"           => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            _                 => "application/octet-stream"
        };

        // Force download for documents; inline display for images
        var cd = ext is ".pdf" or ".doc" or ".docx" ? "attachment" : "inline";
        Response.Headers.Append("Content-Disposition", $"{cd}; filename=\"{fileName}\"");

        return PhysicalFile(filePath, contentType);
    }

    // -------------------------------------------------------------------------

    private async Task<IActionResult> ProcessFileUpload(
        IFormFile file,
        string subFolder,
        FileUploadPolicy policy)
    {
        if (file is null || file.Length == 0)
            return BadRequest(new { error = "No file uploaded." });

        if (file.Length > policy.MaxBytes)
            return BadRequest(new { error = $"File exceeds the {policy.MaxBytes / 1024 / 1024} MB size limit." });

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!policy.AllowedExtensions.Contains(extension))
            return BadRequest(new { error = $"File type '{extension}' is not permitted for this upload." });

        // Magic byte validation
        if (!await HasValidSignatureAsync(file, extension))
        {
            _logger.LogWarning("File signature mismatch for upload: reported extension={Extension}, filename={FileName}",
                extension, file.FileName);
            return UnprocessableEntity(new { error = "File content does not match the declared file type." });
        }

        var uploadsRoot = GetUploadsRoot();
        var uploadsFolder = Path.Combine(uploadsRoot, subFolder);
        Directory.CreateDirectory(uploadsFolder);

        // Randomised filename — never trust the original name
        var safeFileName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(uploadsFolder, safeFileName);

        await using (var stream = new FileStream(filePath, FileMode.Create, FileAccess.Write))
        {
            await file.CopyToAsync(stream);
        }

        // Return a URL pointing to the serving endpoint (not a raw wwwroot path)
        var url = Url.Action(nameof(ServeFile), "Uploads", new { category = subFolder, fileName = safeFileName });
        return Ok(new { url });
    }

    private static async Task<bool> HasValidSignatureAsync(IFormFile file, string extension)
    {
        // SVG has no binary magic bytes — accept by extension only (SVG is already removed from policies above)
        if (!MagicBytes.TryGetValue(extension, out var signatures) || signatures.Length == 0)
            return true;

        var maxHeader = signatures.Max(s => s.Length);
        var header = new byte[maxHeader];

        using var stream = file.OpenReadStream();
        var bytesRead = await stream.ReadAsync(header.AsMemory(0, maxHeader));

        return signatures.Any(sig =>
            bytesRead >= sig.Length &&
            header.Take(sig.Length).SequenceEqual(sig));
    }

    /// <summary>
    /// Returns the uploads root directory, which sits OUTSIDE wwwroot
    /// so the web server cannot serve files directly.
    /// </summary>
    private string GetUploadsRoot()
        => Path.Combine(_environment.ContentRootPath, "secure-uploads");
}

/// <summary>Per-endpoint upload policy.</summary>
internal record FileUploadPolicy(string[] AllowedExtensions, long MaxBytes);
