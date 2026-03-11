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

    /// <summary>
    /// Initializes a new ProjectsController with the required project, comment, and reaction services.
    /// </summary>
    public ProjectsController(
        IProjectService projectService,
        ICommentService commentService,
        IReactionService reactionService)
    {
        _projectService = projectService;
        _commentService = commentService;
        _reactionService = reactionService;
    }

    /// <summary>
    /// Gets a paged list of projects that match the specified query parameters.
    /// </summary>
    /// <param name="parameters">Filters, sorting and pagination options to apply to the project query.</param>
    /// <returns>A paged result containing matching <see cref="ProjectDto"/> items and pagination metadata.</returns>
    [HttpGet]
    public async Task<ActionResult<PagedResult<ProjectDto>>> GetProjects([FromQuery] ProjectQueryDto parameters, CancellationToken cancellationToken)
    {
        var result = await _projectService.GetProjectsAsync(parameters, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Retrieve a project by its slug.
    /// </summary>
    /// <param name="slug">The URL-friendly identifier of the project.</param>
    /// <returns>The requested <see cref="ProjectDto"/> when found; otherwise a NotFound result.</returns>
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


    /// <summary>
    /// Retrieves the collection of featured projects.
    /// </summary>
    /// <returns>A list of featured ProjectDto objects.</returns>
    [HttpGet("featured")]
    public async Task<ActionResult<List<ProjectDto>>> GetFeaturedProjects(CancellationToken cancellationToken)
    {
        var projects = await _projectService.GetFeaturedProjectsAsync(cancellationToken);
        return Ok(projects);
    }

    /// <summary>
    /// Retrieves projects related to the project identified by the specified slug.
    /// </summary>
    /// <param name="slug">The unique slug identifying the source project.</param>
    /// <returns>A list of ProjectDto representing projects related to the specified project.</returns>
    [HttpGet("{slug}/related")]
    public async Task<ActionResult<List<ProjectDto>>> GetRelatedProjects(string slug, CancellationToken cancellationToken)
    {
        var projects = await _projectService.GetRelatedProjectsAsync(slug, cancellationToken);
        return Ok(projects);
    }

    /// <summary>
    /// Creates a new project using the provided creation data.
    /// </summary>
    /// <param name="request">Data required to create the project.</param>
    /// <returns>The created ProjectDto containing the project's details.</returns>
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ProjectDto>> CreateProject(ProjectCreateDto request, CancellationToken cancellationToken)
    {
        var project = await _projectService.CreateProjectAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetProject), new { slug = project.Slug }, project);
    }

    /// <summary>
    /// Updates an existing project identified by the route ID.
    /// </summary>
    /// <param name="id">The project identifier from the route; this value is applied to the request's Id.</param>
    /// <param name="request">The updated project data; its Id will be overwritten with the route id.</param>
    /// <returns>The updated ProjectDto when the project is found and updated; otherwise a NotFound result.</returns>
    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult<ProjectDto>> UpdateProject(Guid id, ProjectUpdateDto request, CancellationToken cancellationToken)
    {
        request.Id = id; // Ensure ID matches route
        var project = await _projectService.UpdateProjectAsync(id, request, cancellationToken);
        if (project == null)
        {
            return NotFound($"Project with ID {id} not found");
        }
        return Ok(project);
    }

    /// <summary>
    /// Deletes the project identified by the specified ID.
    /// </summary>
    /// <param name="id">The unique identifier of the project to delete.</param>
    /// <returns>No content (204) if the project was deleted; 404 NotFound if no project with the specified ID exists.</returns>
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

    /// <summary>
    /// Adds a reaction to the specified project.
    /// </summary>
    /// <param name="projectId">The identifier of the project to add the reaction to.</param>
    /// <param name="request">Details of the reaction to create.</param>
    /// <returns>The created ReactionDto representing the added reaction.</returns>
    [HttpPost("{projectId}/react")]
    public async Task<ActionResult<ReactionDto>> ReactToProject(Guid projectId, ReactionCreateDto request)
    {
        var reaction = await _reactionService.AddReactionAsync(projectId, request);
        return Ok(reaction);
    }

    /// <summary>
    /// Removes a user's reaction from the specified project.
    /// </summary>
    /// <param name="projectId">The unique identifier of the project.</param>
    /// <param name="userId">The identifier of the user whose reaction should be removed.</param>
    /// <returns>`204 No Content` on success; `404 Not Found` with message "Reaction not found" if no matching reaction exists.</returns>
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

    /// <summary>
    /// Retrieve all reactions for the project identified by the specified ID.
    /// </summary>
    /// <returns>A list of <see cref="ReactionDto"/> representing reactions associated with the project; an empty list if none exist.</returns>
    [HttpGet("{projectId}/reactions")]
    public async Task<ActionResult<List<ReactionDto>>> GetProjectReactions(Guid projectId)
    {
        var reactions = await _reactionService.GetProjectReactionsAsync(projectId);
        return Ok(reactions);
    }

    /// <summary>
    /// Adds a new comment to the specified project.
    /// </summary>
    /// <param name="projectId">The identifier of the project to which the comment will be added.</param>
    /// <param name="request">The data required to create the comment.</param>
    /// <returns>The created comment as a <see cref="CommentDto"/>.</returns>
    [HttpPost("{projectId}/comments")]
    public async Task<ActionResult<CommentDto>> AddComment(Guid projectId, CommentCreateDto request)
    {
        var comment = await _commentService.AddCommentAsync(projectId, request);
        return Ok(comment);
    }

    /// <summary>
    /// Adds a reply to an existing comment on a project.
    /// </summary>
    /// <param name="projectId">The identifier of the project containing the comment.</param>
    /// <param name="commentId">The identifier of the comment being replied to.</param>
    /// <param name="request">The reply content and related metadata.</param>
    /// <returns>The created comment as a <see cref="CommentDto"/>.</returns>
    [HttpPost("{projectId}/comments/{commentId}/reply")]
    public async Task<ActionResult<CommentDto>> AddReply(Guid projectId, Guid commentId, CommentCreateDto request)
    {
        var comment = await _commentService.AddReplyAsync(projectId, commentId, request);
        return Ok(comment);
    }

    /// <summary>
    /// Increments the like count for a comment on a project and returns the updated count.
    /// </summary>
    /// <param name="projectId">The project's unique identifier.</param>
    /// <param name="commentId">The comment's unique identifier.</param>
    /// <returns>The updated number of likes for the specified comment.</returns>
    [HttpPost("{projectId}/comments/{commentId}/like")]
    public async Task<ActionResult<int>> LikeComment(Guid projectId, Guid commentId)
    {
        var likeCount = await _commentService.LikeCommentAsync(projectId, commentId);
        return Ok(likeCount);
    }

    /// <summary>
    /// Imports a project from the specified URL and returns the created or updated project.
    /// </summary>
    /// <param name="request">Import parameters containing the source URL and optional metadata for the import.</param>
    /// <returns>The created or updated ProjectDto representing the imported project.</returns>
    [Authorize]
    [HttpPost("import-from-url")]
    public async Task<ActionResult<ProjectDto>> ImportFromUrl([FromBody] ImportRequest request)
    {
        var project = await _projectService.ImportFromUrlAsync(request);
        return Ok(project);
    }

    /// <summary>
    /// Provides a simple JSON response indicating CORS is configured correctly.
    /// </summary>
    /// <returns>An OK response containing an object with a Message property set to "CORS test successful".</returns>
    [HttpGet("test-cors")]
    public IActionResult TestCors()
    {
        return Ok(new { Message = "CORS test successful" });
    }

    /// <summary>
    /// Gets a list of suggested project tags.
    /// </summary>
    /// <returns>A list of suggested tag names.</returns>
    [HttpGet("suggestions/tags")]
    public ActionResult<List<string>> GetTagSuggestions()
    {
        // For now return dummy data or extract from DB
        return Ok(new List<string> { "Angular", "React", ".NET", "TypeScript", "SQL Server" });
    }

    /// <summary>
    /// Provides sample category suggestions for projects.
    /// </summary>
    /// <returns>A list of category suggestion strings.</returns>
    [HttpGet("suggestions/categories")]
    public ActionResult<List<string>> GetCategorySuggestions()
    {
        return Ok(new List<string> { "Web", "Mobile", "Desktop", "AI", "Cloud" });
    }

    /// <summary>
    /// Provides example niche suggestion labels for autocomplete or filtering.
    /// </summary>
    /// <returns>A list of niche suggestion strings such as "Fintech", "Healthcare", "E-commerce", and "Education".</returns>
    [HttpGet("suggestions/niches")]
    public ActionResult<List<string>> GetNicheSuggestions()
    {
        return Ok(new List<string> { "Fintech", "Healthcare", "E-commerce", "Education" });
    }

    /// <summary>
    /// Provides a short list of example company suggestions for project creation.
    /// </summary>
    /// <returns>A list of anonymous objects each with a `Name` property containing a suggested company name.</returns>
    [HttpGet("suggestions/companies")]
    public ActionResult<List<object>> GetCompanySuggestions()
    {
        return Ok(new List<object> { new { Name = "Freelance" }, new { Name = "Personal" } });
    }
}