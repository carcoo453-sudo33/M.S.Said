using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolio.API.Entities;

namespace Portfolio.API.Infrastructure.Data.Configurations;

public class BaseEntityConfiguration<T> : IEntityTypeConfiguration<T> where T : BaseEntity
{
    public virtual void Configure(EntityTypeBuilder<T> builder)
    {
        builder.HasQueryFilter(x => !x.IsDeleted);
    }
}

public class ProjectImageConfiguration : BaseEntityConfiguration<ProjectImage> { }
public class SignatureConfiguration : BaseEntityConfiguration<Signature> { }
public class TechnicalFocusConfiguration : BaseEntityConfiguration<TechnicalFocus> { }
public class SeoConfiguration : BaseEntityConfiguration<Seo> { }
public class EducationConfiguration : BaseEntityConfiguration<Education> { }
public class SkillConfiguration : BaseEntityConfiguration<Skill> { }
public class ReferenceConfiguration : BaseEntityConfiguration<Reference> { }
public class KeyFeatureConfiguration : BaseEntityConfiguration<KeyFeature> { }
public class ChangelogItemConfiguration : BaseEntityConfiguration<ChangelogItem> { }
public class CommentConfiguration : BaseEntityConfiguration<Comment> { }
public class ReactionConfiguration : BaseEntityConfiguration<Reaction> { }
public class NotificationConfiguration : BaseEntityConfiguration<Notification> { }
public class CategoryConfiguration : BaseEntityConfiguration<Category> { }
public class NicheConfiguration : BaseEntityConfiguration<Niche> { }
public class ContactMessageConfiguration : BaseEntityConfiguration<ContactMessage> { }
