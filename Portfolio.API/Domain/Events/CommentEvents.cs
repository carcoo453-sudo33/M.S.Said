namespace Portfolio.API.Events;

public class CommentAddedEvent : BaseEvent
{
    public Guid CommentId { get; }
    public Guid ProjectId { get; }
    public string Author { get; }
    public string Content { get; }

    public CommentAddedEvent(Guid commentId, Guid projectId, string author, string content)
    {
        CommentId = commentId;
        ProjectId = projectId;
        Author = author;
        Content = content;
    }
}

public class ReplyAddedEvent : BaseEvent
{
    public Guid ReplyId { get; }
    public Guid CommentId { get; }
    public Guid ProjectId { get; }
    public string Author { get; }
    public string Content { get; }

    public ReplyAddedEvent(Guid replyId, Guid commentId, Guid projectId, string author, string content)
    {
        ReplyId = replyId;
        CommentId = commentId;
        ProjectId = projectId;
        Author = author;
        Content = content;
    }
}

public class CommentLikedEvent : BaseEvent
{
    public Guid CommentId { get; }
    public Guid ProjectId { get; }
    public int LikeCount { get; }

    public CommentLikedEvent(Guid commentId, Guid projectId, int likeCount)
    {
        CommentId = commentId;
        ProjectId = projectId;
        LikeCount = likeCount;
    }
}