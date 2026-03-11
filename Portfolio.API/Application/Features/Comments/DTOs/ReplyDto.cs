namespace Portfolio.API.Application.Features.Comments.DTOs;

public class ReplyDto
{
    public Guid Id { get; set; }
    public string Author { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime Date { get; set; }
}


