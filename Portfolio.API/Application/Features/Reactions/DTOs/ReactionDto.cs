namespace Portfolio.API.Application.Features.Reactions.DTOs;

public class ReactionDto
{
    public Guid Id { get; set; }
    public Guid ProjectId { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string ReactionType { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}



