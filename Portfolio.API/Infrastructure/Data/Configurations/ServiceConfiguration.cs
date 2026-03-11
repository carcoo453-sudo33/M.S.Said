using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolio.API.Entities;

namespace Portfolio.API.Infrastructure.Data.Configurations;

public class ServiceConfiguration : IEntityTypeConfiguration<Service>
{
    public void Configure(EntityTypeBuilder<Service> builder)
    {
        builder.HasQueryFilter(x => !x.IsDeleted);

        builder.HasOne(s => s.Seo)
            .WithOne()
            .HasForeignKey<Seo>(seo => seo.EntityId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
