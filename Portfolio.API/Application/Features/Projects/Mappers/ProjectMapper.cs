using Portfolio.API.Application.Features.Projects.DTOs;
using Portfolio.API.Entities;
using Portfolio.API.Domain.Enums;
using Portfolio.API.Helpers;
using System.Text.Json;

namespace Portfolio.API.Application.Features.Projects.Mappers;

public static class ProjectMapper
{
    public static ProjectDto ToResponse(Project entity)
    {
        return new ProjectDto
        {
            Id = entity.Id,
            Title = entity.Title,
            Title_Ar = entity.Title_Ar,
            Slug = entity.Slug,
            Description = entity.Description,
            Description_Ar = entity.Description_Ar,
            Summary = entity.Summary,
            Summary_Ar = entity.Summary_Ar,
            ImageUrl = entity.ImageUrl,
            ProjectUrl = entity.DemoUrl,
            GitHubUrl = entity.RepoUrl,
            Category = entity.Category,
            Category_Ar = entity.Category_Ar,
            TechStack = entity.TechStack,
            Niche = entity.Niche,
            Niche_Ar = entity.Niche_Ar,
            Company = entity.Company,
            Company_Ar = entity.Company_Ar,
            Duration = entity.Duration,
            Duration_Ar = entity.Duration_Ar,
            Language = entity.Language,
            Language_Ar = entity.Language_Ar,
            Architecture = entity.Architecture,
            Architecture_Ar = entity.Architecture_Ar,
            Status = entity.Status,
            Status_Ar = entity.Status_Ar,
            Type = entity.Type,
            Type_Ar = entity.Type_Ar,
            DevelopmentMethod = entity.DevelopmentMethod,
            DevelopmentMethod_Ar = entity.DevelopmentMethod_Ar,
            Order = entity.Order,
            IsFeatured = entity.IsFeatured,
            Views = entity.Views,
            ReactionsCount = entity.ReactionsCount,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt,
            Responsibilities = JsonHelper.DeserializeList<ResponsibilityDto>(entity.ResponsibilitiesJson),
            KeyFeatures = entity.KeyFeatures?.Select(KeyFeatureMapper.ToResponse).ToList() ?? new(),
            Changelog = entity.Changelog?.Select(ChangelogItemMapper.ToResponse).ToList() ?? new()
        };
    }

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
            ResponsibilitiesJson = JsonSerializer.Serialize(request.Responsibilities)
            // Note: KeyFeatures, Changelog, and Images are mapped in the Service layer
            // AFTER the Project is saved so we have a valid ProjectId for the foreign keys.
        };
    }

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

        // Update images
        entity.Images.Clear();
        foreach (var img in request.Images ?? new List<ProjectImageCreateDto>())
        {
            entity.Images.Add(new ProjectImage
            {
                ProjectId = entity.Id,
                ImageUrl = img.ImageUrl,
                Title = img.Title,
                Title_Ar = img.Title_Ar,
                Type = img.Type,
                Order = img.Order,
                Description = img.Description,
                Description_Ar = img.Description_Ar
            });
        }

        // Update key features
        entity.KeyFeatures.Clear();
        foreach (var feature in request.KeyFeatures?.Select(f => KeyFeatureMapper.ToEntity(f, entity.Id)) ?? new List<KeyFeature>())
        {
            entity.KeyFeatures.Add(feature);
        }

        // Update changelog
        entity.Changelog.Clear();
        foreach (var item in request.Changelog?.Select(c => ChangelogItemMapper.ToEntity(c, entity.Id)) ?? new List<ChangelogItem>())
        {
            entity.Changelog.Add(item);
        }
    }
}


