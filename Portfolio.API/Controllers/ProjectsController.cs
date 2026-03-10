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
    public async Task<ActionResult<PagedResult<ProjectDto>>> GetProjects([FromQuery] ProjectQueryDto parameters, CancellationToken cancellationToken)
    {
        var result = await _projectService.GetProjectsAsync(parameters, cancellationToken);
        return Ok(result);
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<ProjectDto>> GetProject(string slug, CancellationToken cancellationToken)
    {
        var project = await _projectService.GetProjectBySlugAsync(slug, cancellationToken);
        if (project == null)
        {
            return NotFound($"Project with slug '{slug}' not found");
        }

        return Ok(project);
    }

    [HttpPost("{slug}/views")]
    public async Task<IActionResult> TrackProjectView(string slug, CancellationToken cancellationToken)
    {
        var success = await _projectService.TrackProjectViewAsync(slug, cancellationToken);
        if (!success)
        {
            return NotFound($"Project with slug '{slug}' not found");
        }

        return Ok();
    }

    [HttpGet("featured")]
    public async Task<ActionResult<List<ProjectDto>>> GetFeaturedProjects(CancellationToken cancellationToken)
    {
        var projects = await _projectService.GetFeaturedProjectsAsync(cancellationToken);
        return Ok(projects);
    }

    [HttpGet("{slug}/related")]
    public async Task<ActionResult<List<ProjectDto>>> GetRelatedProjects(string slug, CancellationToken cancellationToken)
    {
        var projects = await _projectService.GetRelatedProjectsAsync(slug, cancellationToken);
        return Ok(projects);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ProjectDto>> CreateProject(ProjectCreateDto request, CancellationToken cancellationToken)
    {
        var project = await _projectService.CreateProjectAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetProject), new { slug = project.Slug }, project);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult<ProjectDto>> UpdateProject(Guid id, ProjectUpdateDto request, CancellationToken cancellationToken)
    {
        var project = await _projectService.UpdateProjectAsync(id, request, cancellationToken);
        if (project == null)
        {
            return NotFound($"Project with ID {id} not found");
        }

        return Ok(project);
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProject(Guid id, CancellationToken cancellationToken)
    {
        var result = await _projectService.DeleteProjectAsync(id, cancellationToken);
        if (!result)
        {
            return NotFound($"Project with ID {id} not found");
        }

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
    [HttpPost("import-from-url")]
    public async Task<ActionResult<ProjectDto>> ImportFromUrl([FromBody] ImportRequest request)
    {
        var project = await _projectService.ImportFromUrlAsync(request);
        return Ok(project);
    }

    [HttpGet("test-cors")]
    public IActionResult TestCors()
    {
        return Ok(new { Message = "CORS test successful" });
    }

    [HttpGet("suggestions/tags")]
    public ActionResult<List<string>> GetTagSuggestions()
    {
        // For now return dummy data or extract from DB
        return Ok(new List<string> { "Angular", "React", ".NET", "TypeScript", "SQL Server" });
    }

    [HttpGet("suggestions/categories")]
    public ActionResult<List<string>> GetCategorySuggestions()
    {
        return Ok(new List<string> { "Web", "Mobile", "Desktop", "AI", "Cloud" });
    }

    [HttpGet("suggestions/niches")]
    public ActionResult<List<string>> GetNicheSuggestions()
    {
        return Ok(new List<string> { "Fintech", "Healthcare", "E-commerce", "Education" });
    }

    [HttpGet("suggestions/companies")]
    public ActionResult<List<object>> GetCompanySuggestions()
    {
        return Ok(new List<object> { new { Name = "Freelance" }, new { Name = "Personal" } });
    }
}