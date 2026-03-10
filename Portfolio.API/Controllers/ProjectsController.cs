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
    private readonly ILogger<ProjectsController> _logger;

    public ProjectsController(
        IProjectService projectService,
        ICommentService commentService,
        IReactionService reactionService,
        ILogger<ProjectsController> logger)
    {
        _projectService = projectService;
        _commentService = commentService;
        _reactionService = reactionService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<ProjectDto>>> GetProjects([FromQuery] ProjectQueryDto parameters)
    {
        try
        {
            var result = await _projectService.GetProjectsAsync(parameters);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving projects");
            return StatusCode(500, "An error occurred while retrieving projects");
        }
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<ProjectDto>> GetProject(string slug)
    {
        try
        {
            var project = await _projectService.GetProjectBySlugAsync(slug);
            if (project == null)
            {
                return NotFound($"Project with slug '{slug}' not found");
            }

            return Ok(project);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving project {Slug}", slug);
            return StatusCode(500, "An error occurred while retrieving the project");
        }
    }

    [HttpGet("featured")]
    public async Task<ActionResult<List<ProjectDto>>> GetFeaturedProjects()
    {
        try
        {
            var projects = await _projectService.GetFeaturedProjectsAsync();
            return Ok(projects);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving featured projects");
            return StatusCode(500, "An error occurred while retrieving featured projects");
        }
    }

    [HttpGet("{slug}/related")]
    public async Task<ActionResult<List<ProjectDto>>> GetRelatedProjects(string slug)
    {
        try
        {
            var projects = await _projectService.GetRelatedProjectsAsync(slug);
            return Ok(projects);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving related projects for {Slug}", slug);
            return StatusCode(500, "An error occurred while retrieving related projects");
        }
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ProjectDto>> CreateProject(ProjectCreateDto request)
    {
        try
        {
            var project = await _projectService.CreateProjectAsync(request);
            return CreatedAtAction(nameof(GetProject), new { slug = project.Slug }, project);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning("Validation error creating project: {Error}", ex.Message);
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating project");
            return StatusCode(500, "An error occurred while creating the project");
        }
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult<ProjectDto>> UpdateProject(Guid id, ProjectUpdateDto request)
    {
        try
        {
            request.Id = id; // Ensure ID matches route
            var project = await _projectService.UpdateProjectAsync(id, request);
            return Ok(project);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning("Validation error updating project {Id}: {Error}", id, ex.Message);
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating project {Id}", id);
            return StatusCode(500, "An error occurred while updating the project");
        }
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteProject(Guid id)
    {
        try
        {
            await _projectService.DeleteProjectAsync(id);
            return NoContent();
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning("Error deleting project {Id}: {Error}", id, ex.Message);
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting project {Id}", id);
            return StatusCode(500, "An error occurred while deleting the project");
        }
    }

    [HttpPost("{projectId}/react")]
    public async Task<ActionResult<ReactionDto>> ReactToProject(Guid projectId, ReactionCreateDto request)
    {
        try
        {
            var reaction = await _reactionService.AddReactionAsync(projectId, request);
            return Ok(reaction);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning("Error reacting to project {ProjectId}: {Error}", projectId, ex.Message);
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error reacting to project {ProjectId}", projectId);
            return StatusCode(500, "An error occurred while reacting to the project");
        }
    }

    [HttpDelete("{projectId}/react/{userId}")]
    public async Task<ActionResult> RemoveReaction(Guid projectId, string userId)
    {
        try
        {
            var removed = await _reactionService.RemoveReactionAsync(projectId, userId);
            if (!removed)
            {
                return NotFound("Reaction not found");
            }
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing reaction from project {ProjectId}", projectId);
            return StatusCode(500, "An error occurred while removing the reaction");
        }
    }

    [HttpGet("{projectId}/reactions")]
    public async Task<ActionResult<List<ReactionDto>>> GetProjectReactions(Guid projectId)
    {
        try
        {
            var reactions = await _reactionService.GetProjectReactionsAsync(projectId);
            return Ok(reactions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving reactions for project {ProjectId}", projectId);
            return StatusCode(500, "An error occurred while retrieving reactions");
        }
    }

    [HttpPost("{projectId}/comments")]
    public async Task<ActionResult<CommentDto>> AddComment(Guid projectId, CommentCreateDto request)
    {
        try
        {
            var comment = await _commentService.AddCommentAsync(projectId, request);
            return Ok(comment);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning("Validation error adding comment to project {ProjectId}: {Error}", projectId, ex.Message);
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding comment to project {ProjectId}", projectId);
            return StatusCode(500, "An error occurred while adding the comment");
        }
    }

    [HttpPost("{projectId}/comments/{commentId}/reply")]
    public async Task<ActionResult<CommentDto>> AddReply(Guid projectId, Guid commentId, CommentCreateDto request)
    {
        try
        {
            var comment = await _commentService.AddReplyAsync(projectId, commentId, request);
            return Ok(comment);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning("Validation error adding reply to comment {CommentId}: {Error}", commentId, ex.Message);
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding reply to comment {CommentId}", commentId);
            return StatusCode(500, "An error occurred while adding the reply");
        }
    }

    [HttpPost("{projectId}/comments/{commentId}/like")]
    public async Task<ActionResult<int>> LikeComment(Guid projectId, Guid commentId)
    {
        try
        {
            var likeCount = await _commentService.LikeCommentAsync(projectId, commentId);
            return Ok(likeCount);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning("Error liking comment {CommentId}: {Error}", commentId, ex.Message);
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error liking comment {CommentId}", commentId);
            return StatusCode(500, "An error occurred while liking the comment");
        }
    }

    [Authorize]
    [HttpPost("{projectId}/import-from-github")]
    public async Task<ActionResult<ProjectDto>> ImportFromGitHub(Guid projectId, [FromBody] GitHubImportDto request)
    {
        try
        {
            var project = await _projectService.ImportFromGitHubAsync(projectId, request.GitHubUrl);
            return Ok(project);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning("Error importing from GitHub for project {ProjectId}: {Error}", projectId, ex.Message);
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error importing from GitHub for project {ProjectId}", projectId);
            return StatusCode(500, "An error occurred while importing from GitHub");
        }
    }
}