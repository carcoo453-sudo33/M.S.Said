using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Portfolio.API.Entities;

namespace Portfolio.API.Data;

public class PortfolioDbContext : IdentityDbContext
{
    public PortfolioDbContext(DbContextOptions<PortfolioDbContext> options) : base(options)
    {
    }

    public DbSet<ExperienceEntry> Experiences { get; set; }
    public DbSet<ProjectEntry> Projects { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        
        // Soft delete global query filter
        builder.Entity<ExperienceEntry>().HasQueryFilter(x => !x.IsDeleted);
        builder.Entity<ProjectEntry>().HasQueryFilter(x => !x.IsDeleted);
    }

    public override int SaveChanges()
    {
        HandleSoftDelete();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        HandleSoftDelete();
        return base.SaveChangesAsync(cancellationToken);
    }

    private void HandleSoftDelete()
    {
        var entities = ChangeTracker.Entries()
            .Where(e => e.State == EntityState.Deleted && e.Entity is BaseEntity);

        foreach (var entity in entities)
        {
            entity.State = EntityState.Modified;
            ((BaseEntity)entity.Entity).IsDeleted = true;
            ((BaseEntity)entity.Entity).UpdatedAt = DateTime.UtcNow;
        }

        var modifiedEntities = ChangeTracker.Entries()
            .Where(e => e.State == EntityState.Modified && e.Entity is BaseEntity);

        foreach (var entity in modifiedEntities)
        {
            ((BaseEntity)entity.Entity).UpdatedAt = DateTime.UtcNow;
        }
    }
}
