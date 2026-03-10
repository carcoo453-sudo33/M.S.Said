namespace Portfolio.API.Features.Reactions.DTOs;

public class ReactionCreateDto
{
    public string UserId { get; set; } = string.Empty;
    public string ReactionType { get; set; } = string.Empty; // e.g., "like", "love", "wow"
}