namespace Portfolio.API.Domain.Enums;

/// <summary>
/// Types of project images
/// Real: Production screenshots from live project (default)
/// Base: Design mockups, wireframes, color palettes, logos, slogans
/// Wireframe: Low-fidelity wireframes and sketches
/// Fixing: Bug fixes and improvements screenshots
/// </summary>
public enum ProjectImageType
{
    Real = 0,      // Production screenshots (default)
    Base = 1,      // Design mockups, wireframes, color palettes, logos, slogans
    Wireframe = 2, // Low-fidelity wireframes and sketches
    Fixing = 3     // Bug fixes and improvements
}
