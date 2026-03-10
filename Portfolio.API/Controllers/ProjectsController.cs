using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.API.Application.Features.Projects.DTOs;
using Portfolio.API.Application.Features.Projects.Services;
using Portfolio.API.Application.Features.Comments.DTOs;
using Portfolio.API.Application.Features.Comments.Services;
using Portfolio.API.Application.Features.Reactions.DTOs;
using Portfolio.API.Application.Features.Reactions.Services;
using Portfolio.API.Application.Common;

namespace Portfolio.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly IProjectService _projectService;
    private readonly ICommentService _commentService;
    private readonly IReactionService _reactionService;

    public ProjectsController(
        IProjectService projectService,
        ICommentService commentService,
        IReactionService reactionService)
    {
        _projectService = projectService;
        _commentService = commentService;
        _reactionService = reactionService;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<ProjectDto>>> GetProjects([FromQuery] ProjectQueryDto parameters)
    {
        var result = await _projectService.GetProjectsAsync(parameters);
        return Ok(result);
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<ProjectDto>> GetProject(string slug)
    {
        var project = await _projectService.GetProjectBySlugAsync(slug);
        if (project == null)
        {
            return NotFound($"Project with slug '{slug}' not found");
        }

        return Ok(project);
    }

    [HttpGet("featured")]
    public async Task<ActionResult<List<ProjectDto>>> GetFeaturedProjects()
    {
        var projects = await _projectService.GetFeaturedProjectsAsync();
        return Ok(projects);
    }

    [HttpGet("{slug}/related")]
    public async Task<ActionResult<List<ProjectDto>>> GetRelatedProjects(string slug)
    {
        var projects = await _projectService.GetRelatedProjectsAsync(slug);
        return Ok(projects);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ProjectDto>> CreateProject(ProjectCreateDto request)
    {
        var project = await _projectService.CreateProjectAsync(request);
        return CreatedAtAction(nameof(GetProject), new { slug = project.Slug }, project);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult<ProjectDto>> UpdateProject(Guid id, ProjectUpdateDto request)
    {
        request.Id = id; // Ensure ID matches route
        var project = await _projectService.UpdateProjectAsync(id, request);
        if (project == null) return NotFound();
        return Ok(project);
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteProject(Guid id)
    {
        var deleted = await _projectService.DeleteProjectAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }

    [HttpPost("{projectId}/react")]
    public async Task<ActionResult<ReactionDto>> ReactToProject(Guid projectId, ReactionCreateDto request)
    {
        var reaction = await _reactionService.AddReactionAsync(projectId, request);
        return Ok(reaction);
    }

    [HttpDelete("{projectId}/react/{userId}")]
    public async Task<ActionResult> RemoveReaction(Guid projectId, string userId)
    {
        var removed = await _reactionService.RemoveReactionAsync(projectId, userId);
        if (!removed)
        {
            return NotFound("Reaction not found");
        }
        return NoContent();
    }

    [HttpGet("{projectId}/reactions")]
    public async Task<ActionResult<List<ReactionDto>>> GetProjectReactions(Guid projectId)
    {
        var reactions = await _reactionService.GetProjectReactionsAsync(projectId);
        return Ok(reactions);
    }

    [HttpPost("{projectId}/comments")]
    public async Task<ActionResult<CommentDto>> AddComment(Guid projectId, CommentCreateDto request)
    {
        var comment = await _commentService.AddCommentAsync(projectId, request);
        return Ok(comment);
    }

    [HttpPost("{projectId}/comments/{commentId}/reply")]
    public async Task<ActionResult<CommentDto>> AddReply(Guid projectId, Guid commentId, CommentCreateDto request)
    {
        var comment = await _commentService.AddReplyAsync(projectId, commentId, request);
        return Ok(comment);
    }

    [HttpPost("{projectId}/comments/{commentId}/like")]
    public async Task<ActionResult<int>> LikeComment(Guid projectId, Guid commentId)
    {
        var likeCount = await _commentService.LikeCommentAsync(projectId, commentId);
        return Ok(likeCount);
    }

    [Authorize]
    [HttpPost("{projectId}/import-from-github")]
    public async Task<ActionResult<ProjectDto>> ImportFromGitHub(Guid projectId, [FromBody] GitHubImportDto request)
    {
        var project = await _projectService.ImportFromGitHubAsync(projectId, request.GitHubUrl);
        return Ok(project);
    }
}