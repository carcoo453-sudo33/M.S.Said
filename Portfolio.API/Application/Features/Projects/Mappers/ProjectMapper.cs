using Portfolio.API.Application.Features.Projects.DTOs;
using Portfolio.API.Entities;
using Portfolio.API.Domain.Enums;
using Portfolio.API.Helpers;
using Portfolio.API.Application.Features.Comments.Mappers;
using System.Text.Json;

namespace Portfolio.API.Application.Features.Projects.Mappers;

public static class ProjectMapper
{
    /// <summary>
    /// Create the API response representation of a project.
    /// </summary>
    /// <param name="entity">The project domain entity to map.</param>
    /// <returns>
    /// A ProjectDto with scalar properties copied from the entity, responsibilities deserialized from the entity's ResponsibilitiesJson, and KeyFeatures and Changelog converted to their DTO forms; any missing collections are returned as empty lists.
    /// </returns>
    public static ProjectDto ToResponse(Project entity)
    {
        return new ProjectDto
        {
            Id = entity.Id,
            Title = entity.Title ?? string.Empty,
            Title_Ar = entity.Title_Ar ?? string.Empty,
            Slug = entity.Slug ?? string.Empty,
            Description = entity.Description ?? string.Empty,
            Description_Ar = entity.Description_Ar ?? string.Empty,
            Summary = entity.Summary ?? string.Empty,
            Summary_Ar = entity.Summary_Ar ?? string.Empty,
            ImageUrl = entity.ImageUrl ?? string.Empty,
            ProjectUrl = entity.DemoUrl ?? string.Empty,
            GitHubUrl = entity.RepoUrl ?? string.Empty,
            Category = entity.Category,
            Category_Ar = entity.Category_Ar ?? string.Empty,
            TechStack = entity.TechStack ?? string.Empty,
            Niche = entity.Niche ?? string.Empty,
            Niche_Ar = entity.Niche_Ar ?? string.Empty,
            Company = entity.Company ?? string.Empty,
            Company_Ar = entity.Company_Ar ?? string.Empty,
            Duration = entity.Duration ?? string.Empty,
            Duration_Ar = entity.Duration_Ar ?? string.Empty,
            Language = entity.Language,
            Language_Ar = entity.Language_Ar ?? string.Empty,
            Architecture = entity.Architecture,
            Architecture_Ar = entity.Architecture_Ar ?? string.Empty,
            Status = entity.Status,
            Status_Ar = entity.Status_Ar ?? string.Empty,
            Type = entity.Type,
            Type_Ar = entity.Type_Ar ?? string.Empty,
            DevelopmentMethod = entity.DevelopmentMethod,
            DevelopmentMethod_Ar = entity.DevelopmentMethod_Ar ?? string.Empty,
            Order = entity.Order,
            IsFeatured = entity.IsFeatured,
            Views = entity.Views,
            ReactionsCount = entity.ReactionsCount,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt,
            Responsibilities = JsonHelper.DeserializeList<ResponsibilityDto>(entity.ResponsibilitiesJson)
                .Select(r => {
                    r.Title = r.Title ?? string.Empty;
                    r.Title_Ar = r.Title_Ar ?? string.Empty;
                    r.Description = r.Description ?? string.Empty;
                    r.Description_Ar = r.Description_Ar ?? string.Empty;
                    return r;
                }).ToList(),
            KeyFeatures = entity.KeyFeatures?.Select(KeyFeatureMapper.ToResponse).ToList() ?? new(),
            Changelog = entity.Changelog?.Select(ChangelogItemMapper.ToResponse).ToList() ?? new(),
            Images = entity.Images?.Select(img => new ProjectImageDto
            {
                Id = img.Id,
                ProjectId = img.ProjectId,
                ImageUrl = img.ImageUrl ?? string.Empty,
                Title = img.Title ?? string.Empty,
                Title_Ar = img.Title_Ar ?? string.Empty,
                Type = img.Type,
                Order = img.Order,
                Description = img.Description ?? string.Empty,
                Description_Ar = img.Description_Ar ?? string.Empty,
                CreatedAt = img.CreatedAt,
                UpdatedAt = img.UpdatedAt
            }).ToList() ?? new(),
            Comments = entity.Comments?.OrderByDescending(c => c.CreatedAt).Select(CommentMapper.ToResponse).ToList() ?? new()
        };
    }

    /// <summary>
    /// Create a Project entity populated from the provided ProjectCreateDto.
    /// </summary>
    /// <param name="request">The DTO containing data for the new project.</param>
    /// <returns>A Project entity with values taken from the request; enum fields use sensible defaults when null and collection properties are initialized when absent.</returns>
    public static Project ToEntity(ProjectCreateDto request)
    {
        return new Project
        {
            Title = request.Title,
            Title_Ar = request.Title_Ar,
            Slug = SlugHelper.GenerateSlug(request.Title),
            Description = request.Description,
            Description_Ar = request.Description_Ar,
            Summary = request.Summary,
            Summary_Ar = request.Summary_Ar,
            ImageUrl = request.ImageUrl,
            DemoUrl = request.ProjectUrl,
            RepoUrl = request.GitHubUrl,
            Category = request.Category,
            Category_Ar = request.Category_Ar,
            TechStack = request.TechStack,
            Niche = request.Niche,
            Niche_Ar = request.Niche_Ar,
            Company = request.Company,
            Company_Ar = request.Company_Ar,
            Duration = request.Duration,
            Duration_Ar = request.Duration_Ar,
            Language = request.Language,
            Language_Ar = request.Language_Ar,
            Architecture = request.Architecture,
            Architecture_Ar = request.Architecture_Ar,
            Status = request.Status ?? ProjectStatus.Planning,
            Status_Ar = request.Status_Ar,
            Type = request.Type ?? ProjectType.Initial,
            Type_Ar = request.Type_Ar,
            DevelopmentMethod = request.DevelopmentMethod ?? DevelopmentMethod.Manual,
            DevelopmentMethod_Ar = request.DevelopmentMethod_Ar,
            Order = request.Order,
            IsFeatured = request.IsFeatured,
            Views = 0,
            ReactionsCount = 0,
            ResponsibilitiesJson = JsonSerializer.Serialize(request.Responsibilities),
            KeyFeatures = request.KeyFeatures?.Select(kf => KeyFeatureMapper.ToEntity(kf)).ToList() ?? new(),
            Changelog = request.Changelog?.Select(cl => ChangelogItemMapper.ToEntity(cl)).ToList() ?? new(),
            Images = request.Images?.Select(img => new ProjectImage
            {
                ImageUrl = img.ImageUrl,
                Title = img.Title,
                Title_Ar = img.Title_Ar,
                Type = img.Type,
                Order = img.Order,
                Description = img.Description,
                Description_Ar = img.Description_Ar
            }).ToList() ?? new()
        };
    }

    /// <summary>
    /// Updates the provided Project entity in place using values from a ProjectUpdateDto.
    /// </summary>
    /// <param name="entity">The existing Project entity to update; its properties and related collections are modified.</param>
    /// <param name="request">The DTO containing updated values to apply to the entity.</param>
    public static void UpdateEntity(Project entity, ProjectUpdateDto request)
    {
        entity.Title = request.Title;
        entity.Title_Ar = request.Title_Ar;
        entity.Slug = SlugHelper.GenerateSlug(request.Title);
        entity.Description = request.Description;
        entity.Description_Ar = request.Description_Ar;
        entity.Summary = request.Summary;
        entity.Summary_Ar = request.Summary_Ar;
        entity.ImageUrl = request.ImageUrl;
        entity.DemoUrl = request.ProjectUrl;
        entity.RepoUrl = request.GitHubUrl;
        entity.Category = request.Category;
        entity.Category_Ar = request.Category_Ar;
        entity.TechStack = request.TechStack;
        entity.Niche = request.Niche;
        entity.Niche_Ar = request.Niche_Ar;
        entity.Company = request.Company;
        entity.Company_Ar = request.Company_Ar;
        entity.Duration = request.Duration;
        entity.Duration_Ar = request.Duration_Ar;
        entity.Language = request.Language;
        entity.Language_Ar = request.Language_Ar;
        entity.Architecture = request.Architecture;
        entity.Architecture_Ar = request.Architecture_Ar;
        entity.Status = request.Status ?? ProjectStatus.Planning;
        entity.Status_Ar = request.Status_Ar;
        entity.Type = request.Type ?? ProjectType.Initial;
        entity.Type_Ar = request.Type_Ar;
        entity.DevelopmentMethod = request.DevelopmentMethod ?? DevelopmentMethod.Manual;
        entity.DevelopmentMethod_Ar = request.DevelopmentMethod_Ar;
        entity.Order = request.Order;
        entity.IsFeatured = request.IsFeatured;
        entity.ResponsibilitiesJson = JsonSerializer.Serialize(request.Responsibilities);

        // Update images using synchronization logic
        var incomingImageUrls = request.Images?.Select(img => img.ImageUrl).ToList() ?? new List<string>();
        // Soft-delete missing ones
        foreach (var existing in entity.Images.Where(img => !img.IsDeleted).ToList())
        {
            if (!incomingImageUrls.Contains(existing.ImageUrl))
            {
                existing.IsDeleted = true;
                existing.UpdatedAt = DateTime.UtcNow;
            }
        }
        // Add or Update
        foreach (var imgDto in request.Images ?? new())
        {
            var existing = entity.Images.FirstOrDefault(img => img.ImageUrl == imgDto.ImageUrl && !img.IsDeleted);
            if (existing != null)
            {
                existing.Title = imgDto.Title;
                existing.Title_Ar = imgDto.Title_Ar;
                existing.Type = imgDto.Type;
                existing.Order = imgDto.Order;
                existing.Description = imgDto.Description;
                existing.Description_Ar = imgDto.Description_Ar;
                existing.UpdatedAt = DateTime.UtcNow;
            }
            else
            {
                entity.Images.Add(new ProjectImage
                {
                    ProjectId = entity.Id,
                    ImageUrl = imgDto.ImageUrl,
                    Title = imgDto.Title,
                    Title_Ar = imgDto.Title_Ar,
                    Type = imgDto.Type,
                    Order = imgDto.Order,
                    Description = imgDto.Description,
                    Description_Ar = imgDto.Description_Ar
                });
            }
        }

        // Update key features using synchronization logic
        var incomingFeatureTitles = request.KeyFeatures?.Select(f => f.Title).ToList() ?? new List<string>();
        // Soft-delete missing ones
        foreach (var existing in entity.KeyFeatures.Where(f => !f.IsDeleted).ToList())
        {
            if (!incomingFeatureTitles.Contains(existing.Title))
            {
                existing.IsDeleted = true;
                existing.UpdatedAt = DateTime.UtcNow;
            }
        }
        // Add or Update
        foreach (var featureDto in request.KeyFeatures ?? new())
        {
            var existing = entity.KeyFeatures.FirstOrDefault(f => f.Title == featureDto.Title && !f.IsDeleted);
            if (existing != null)
            {
                existing.Title_Ar = featureDto.Title_Ar;
                existing.Link = featureDto.Link;
                existing.Date = featureDto.Date;
                existing.FeatureType = featureDto.FeatureType;
                existing.UpdatedAt = DateTime.UtcNow;
            }
            else
            {
                entity.KeyFeatures.Add(KeyFeatureMapper.ToEntity(featureDto, entity.Id));
            }
        }

        // Update changelog using synchronization logic
        var incomingVersions = request.Changelog?.Select(c => c.Version + c.Title).ToList() ?? new List<string>();
        // Soft-delete missing ones
        foreach (var existing in entity.Changelog.Where(c => !c.IsDeleted).ToList())
        {
            if (!incomingVersions.Contains(existing.Version + existing.Title))
            {
                existing.IsDeleted = true;
                existing.UpdatedAt = DateTime.UtcNow;
            }
        }
        // Add or Update
        foreach (var changeDto in request.Changelog ?? new())
        {
            var existing = entity.Changelog.FirstOrDefault(c => (c.Version + c.Title) == (changeDto.Version + changeDto.Title) && !c.IsDeleted);
            if (existing != null)
            {
                existing.Title_Ar = changeDto.Title_Ar;
                existing.Date = changeDto.Date;
                existing.Description = changeDto.Description;
                existing.Description_Ar = changeDto.Description_Ar;
                existing.UpdatedAt = DateTime.UtcNow;
            }
            else
            {
                entity.Changelog.Add(ChangelogItemMapper.ToEntity(changeDto, entity.Id));
            }
        }
    }
}


