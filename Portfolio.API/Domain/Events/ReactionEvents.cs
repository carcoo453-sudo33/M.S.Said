using Portfolio.API.Domain.Enums;

namespace Portfolio.API.Events;

public class ReactionAddedEvent : BaseEvent
{
    public Guid ReactionId { get; }
    public Guid ProjectId { get; }
    public string UserId { get; }
    public ReactionType ReactionType { get; }

    public ReactionAddedEvent(Guid reactionId, Guid projectId, string userId, ReactionType reactionType)
    {
        ReactionId = reactionId;
        ProjectId = projectId;
        UserId = userId;
        ReactionType = reactionType;
    }
}

public class ReactionRemovedEvent : BaseEvent
{
    public Guid ProjectId { get; }
    public string UserId { get; }
    public ReactionType ReactionType { get; }

    public ReactionRemovedEvent(Guid projectId, string userId, ReactionType reactionType)
    {
        ProjectId = projectId;
        UserId = userId;
        ReactionType = reactionType;
    }
}