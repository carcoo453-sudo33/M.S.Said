namespace Portfolio.API.Events;

public class ProjectCreatedEvent : BaseEvent
{
    public Guid ProjectId { get; }
    public string ProjectTitle { get; }
    public string Slug { get; }

    public ProjectCreatedEvent(Guid projectId, string projectTitle, string slug)
    {
        ProjectId = projectId;
        ProjectTitle = projectTitle;
        Slug = slug;
    }
}

public class ProjectUpdatedEvent : BaseEvent
{
    public Guid ProjectId { get; }
    public string ProjectTitle { get; }
    public string Slug { get; }

    public ProjectUpdatedEvent(Guid projectId, string projectTitle, string slug)
    {
        ProjectId = projectId;
        ProjectTitle = projectTitle;
        Slug = slug;
    }
}

public class ProjectDeletedEvent : BaseEvent
{
    public Guid ProjectId { get; }
    public string ProjectTitle { get; }

    public ProjectDeletedEvent(Guid projectId, string projectTitle)
    {
        ProjectId = projectId;
        ProjectTitle = projectTitle;
    }
}

public class ProjectViewedEvent : BaseEvent
{
    public Guid ProjectId { get; }
    public string ProjectTitle { get; }
    public string Slug { get; }

    public ProjectViewedEvent(Guid projectId, string projectTitle, string slug)
    {
        ProjectId = projectId;
        ProjectTitle = projectTitle;
        Slug = slug;
    }
}