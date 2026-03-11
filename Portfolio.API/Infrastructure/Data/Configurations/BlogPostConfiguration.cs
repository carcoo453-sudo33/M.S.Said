using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolio.API.Entities;

namespace Portfolio.API.Infrastructure.Data.Configurations;

public class BlogPostConfiguration : IEntityTypeConfiguration<BlogPost>
{
    public void Configure(EntityTypeBuilder<BlogPost> builder)
    {
        builder.HasQueryFilter(x => !x.IsDeleted);

        builder.HasOne(b => b.Seo)
            .WithOne()
            .HasForeignKey<Seo>(s => s.EntityId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
