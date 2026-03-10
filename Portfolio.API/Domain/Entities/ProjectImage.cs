using System.ComponentModel.DataAnnotations;
using Portfolio.API.Domain.Enums;

namespace Portfolio.API.Entities;

/// <summary>
/// Represents an image for a project with type and title
/// Real images: Production screenshots (max 5, one main)
/// Base images: Design mockups, wireframes, color palettes, logos, slogans
/// Wireframe images: Low-fidelity wireframes and sketches
/// Fixing images: Bug fixes and improvements screenshots
/// </summary>
public class ProjectImage : BaseEntity
{
    [Required]
    public Guid ProjectId { get; set; }

    [Required]
    public string ImageUrl { get; set; } = string.Empty;

    [Required]
    public string Title { get; set; } = string.Empty;

    public string? Title_Ar { get; set; }

    [Required]
    public ProjectImageType Type { get; set; } = ProjectImageType.Real;

    /// <summary>
    /// For Real type: indicates if this is the main/featured image
    /// For other types: display order
    /// </summary>
    public int Order { get; set; } = 0;

    public string? Description { get; set; }
    public string? Description_Ar { get; set; }

    // Navigation
    public virtual Project? Project { get; set; }
}

