using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolio.API.Entities;

namespace Portfolio.API.Infrastructure.Data.Configurations;

public class BioConfiguration : IEntityTypeConfiguration<Bio>
{
    public void Configure(EntityTypeBuilder<Bio> builder)
    {
        builder.HasQueryFilter(x => !x.IsDeleted);

        builder.HasOne(b => b.Signature)
            .WithOne(s => s.Bio)
            .HasForeignKey<Signature>(s => s.BioId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(b => b.TechnicalFocus)
            .WithOne(tf => tf.Bio)
            .HasForeignKey<TechnicalFocus>(tf => tf.BioId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
