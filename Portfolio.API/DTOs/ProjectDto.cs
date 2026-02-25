using System;
using System.Collections.Generic;

namespace Portfolio.API.DTOs;

public class ProjectDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Summary { get; set; }
    public string? Technologies { get; set; }
    public string? Category { get; set; }
    public string? Tags { get; set; }
    public string? Niche { get; set; }
    public string? ImageUrl { get; set; }
    public List<string> Gallery { get; set; } = new();
    public string? ProjectUrl { get; set; }
    public string? GitHubUrl { get; set; }
    public string? Duration { get; set; }
    public string? Language { get; set; }
    public string? Architecture { get; set; }
    public string? Status { get; set; }
    
    public List<KeyFeatureDto> KeyFeatures { get; set; } = new();
    public List<ChangelogItemDto> Changelog { get; set; } = new();
    public List<string> Responsibilities { get; set; } = new();
    public List<MetricDto> Metrics { get; set; } = new();
    public List<CommentDto> Comments { get; set; } = new();
    
    public int ReactionsCount { get; set; }
    public int Views { get; set; }
    public int Order { get; set; }
    public bool IsFeatured { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<ProjectSummaryDto> RelatedProjects { get; set; } = new();
}

public class ProjectSummaryDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public string? Technologies { get; set; }
    public string? Category { get; set; }
}

public class KeyFeatureDto
{
    public string Icon { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class ChangelogItemDto
{
    public string Date { get; set; } = string.Empty;
    public string Version { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class MetricDto
{
    public string Label { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string? Trend { get; set; }
}

public class CommentDto
{
    public string Id { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string Date { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public int Likes { get; set; }
    public List<CommentReplyDto> Replies { get; set; } = new();
}

public class CommentReplyDto
{
    public string Id { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string Date { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
}

public class CreateCommentDto
{
    public string Author { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string Content { get; set; } = string.Empty;
}

public class CreateReplyDto
{
    public string Author { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string Content { get; set; } = string.Empty;
}

public class GitHubImportRequest
{
    public string GitHubUrl { get; set; } = string.Empty;
    public string? GitHubToken { get; set; }
}

public class GitHubReadmeResponse
{
    public string? Content { get; set; }
    public string? Encoding { get; set; }
}

public class GitHubRelease
{
    public string? TagName { get; set; }
    public string? Name { get; set; }
    public string? Body { get; set; }
    public DateTime? PublishedAt { get; set; }
}

public class GitHubRepository
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public int StargazersCount { get; set; }
    public int ForksCount { get; set; }
    public int OpenIssuesCount { get; set; }
    public string? Language { get; set; }
    public string? Homepage { get; set; }
    public List<string>? Topics { get; set; }
}

public class GitHubContentItem
{
    public string Name { get; set; } = string.Empty;
    public string Path { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string? DownloadUrl { get; set; }
    public string? Url { get; set; }
    public long Size { get; set; }
}
