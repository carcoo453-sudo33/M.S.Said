namespace Portfolio.API.Entities;
public class Seo : BaseEntity
{
    public Guid EntityId { get; set; } // ID of the entity this SEO belongs to
    public string EntityType { get; set; } = string.Empty; // Type of entity (Project, Service, BlogPost, etc.)
    
    public string? Slug { get; set; } // URL-friendly identifier
    public string? MetaTitle { get; set; } // SEO title (50-60 chars)
    public string? MetaDescription { get; set; } // SEO description (150-160 chars)
    public string? MetaKeywords { get; set; } // Comma-separated keywords
    public string? OgImage { get; set; } // Open Graph image for social sharing
    public string? OgTitle { get; set; } // Open Graph title
    public string? OgDescription { get; set; } // Open Graph description
    public string? CanonicalUrl { get; set; } // Canonical URL for duplicate content
    public string? StructuredData { get; set; } // JSON-LD structured data
}
