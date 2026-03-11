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

    /// <summary>
    /// Initializes a new instance of <see cref="UploadsController"/> with the provided hosting environment and logger.
    /// </summary>
    public UploadsController(IWebHostEnvironment environment, ILogger<UploadsController> logger)
    {
        _environment = environment;
        _logger = logger;
    }

    /// <summary>
    /// Securely uploads a profile image.
    /// Validates magic bytes, enforces a 5MB limit, and stores the file outside wwwroot.
    /// </summary>
    /// <param name="file">The uploaded image file. Allowed extensions: .jpg, .jpeg, .png, .webp. Maximum size: 5 MB.</param>
    /// <returns>The URL where the uploaded image can be retrieved via the uploads endpoint, or an error response if validation or storage fails.</returns>
    [HttpPost("profile-image")]
    public async Task<IActionResult> UploadProfileImage(IFormFile file)
        => await ProcessFileUpload(file, "avatars", ProfileImagePolicy);

    /// <summary>
    /// Securely uploads a CV (resume).
    /// Enforces PDF/Docx extensions with signature validation and a 10MB limit.
    /// </summary>
    /// <param name="file">The uploaded CV file to validate and store.</param>
    /// <returns>
    /// An <see cref="IActionResult"/> representing the outcome:
    /// - 200 OK with the URL to access the stored CV on success;
    /// - 400 Bad Request for missing or invalid upload or disallowed extension;
    /// - 413 Payload Too Large when the file exceeds the configured maximum size;
    /// - 422 Unprocessable Entity when the file's binary signature does not match the allowed types.
    /// </returns>
    [HttpPost("cv")]
    public async Task<IActionResult> UploadCV(IFormFile file)
        => await ProcessFileUpload(file, "cvs", CvPolicy);

    /// <summary>
    /// Securely uploads a skill icon.
    /// Note: SVG uploads are disabled due to potential XSS/active content risks.
    /// </summary>
    /// <param name="file">The uploaded image file. Allowed extensions: .png, .jpg, .jpeg, .webp; maximum size 2 MB.</param>
    /// <returns>
    /// An <see cref="IActionResult"/> with 200 OK and a URL to the stored file on success;
    /// 400 BadRequest for missing, empty, oversized, or disallowed files;
    /// 422 UnprocessableEntity if the file's binary signature does not match its extension.
    /// </returns>
    [HttpPost("skill-icon")]
    public async Task<IActionResult> UploadSkillIcon(IFormFile file)
        => await ProcessFileUpload(file, "skills", SkillIconPolicy);

    /// <summary>
    /// Securely uploads a project showcase image.
    /// Enforces size limits and randomized filenames for security.
    /// </summary>
    /// <param name="file">The image file uploaded by the client to be stored as a project image.</param>
    /// <returns>
    /// An <see cref="IActionResult"/> that is 200 OK containing a URL to the stored file on success; otherwise a 4xx response describing the validation or processing error.
    /// </returns>
    [HttpPost("project-image")]
    public async Task<IActionResult> UploadProjectImage(IFormFile file)
        => await ProcessFileUpload(file, "projects", ProjectImagePolicy);

    /// <summary>
    /// Serves files from the secure uploads directory (outside wwwroot).
    /// <summary>
    /// Serves a file from the secure uploads directory for the given category and file name.
    /// </summary>
    /// <param name="category">A single path segment identifying the upload subfolder; must not contain "..".</param>
    /// <param name="fileName">The file name within the category folder; must not contain "..".</param>
    /// <returns>
    /// 400 Bad Request if a path segment contains "..", 404 Not Found if the file does not exist,
    /// or a file response with an appropriate Content-Type and Content-Disposition header on success.
    /// </returns>
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

    /// <summary>
    /// Validate an uploaded file against the provided policy, store it in a secure subfolder, and return a URL to retrieve the saved file.
    /// </summary>
    /// <param name="file">The uploaded file to validate and store.</param>
    /// <param name="subFolder">The uploads category subfolder (relative to the secure uploads root) used to store and serve the file.</param>
    /// <param name="policy">The file upload policy defining allowed extensions and maximum size.</param>
    /// <returns>
    /// An <see cref="IActionResult"/> that is:
    /// - 200 OK with a JSON object { url = "..."} containing the serving URL on success;
    /// - 400 BadRequest with a JSON { error = "..."} for missing/invalid files, size or extension violations;
    /// - 422 UnprocessableEntity with a JSON { error = "..."} when the file's content signature does not match its declared type.
    /// </returns>

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

    /// <summary>
    /// Determines whether the uploaded file's initial bytes match one of the known signature patterns for the given file extension.
    /// </summary>
    /// <param name="file">The uploaded file to validate.</param>
    /// <param name="extension">The file extension to validate against (including the leading dot, e.g. ".png").</param>
    /// <returns>`true` if there are no known signatures for the extension or the file's header matches any known signature; `false` otherwise.</returns>
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
    /// Gets the filesystem root directory used for storing uploaded files. This sits OUTSIDE wwwroot so the web server cannot serve files directly.
    /// </summary>
    /// <returns>The absolute path to the application's secure uploads directory (a folder named "secure-uploads" under the application's content root, outside wwwroot).</returns>
    private string GetUploadsRoot()
        => Path.Combine(_environment.ContentRootPath, "secure-uploads");
}

/// <summary>Per-endpoint upload policy.</summary>
internal record FileUploadPolicy(string[] AllowedExtensions, long MaxBytes);
