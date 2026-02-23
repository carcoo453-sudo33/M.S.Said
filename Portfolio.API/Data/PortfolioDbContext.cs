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
    public DbSet<BioEntry> BioEntries { get; set; }
    public DbSet<ServiceEntry> ServiceEntries { get; set; }
    public DbSet<BlogPost> BlogPosts { get; set; }
    public DbSet<EducationEntry> EducationEntries { get; set; }
    public DbSet<ContactMessage> ContactMessages { get; set; }
    public DbSet<SkillEntry> Skills { get; set; }
    public DbSet<ProjectKeyFeature> ProjectKeyFeatures { get; set; }
    public DbSet<ProjectChangelogItem> ProjectChangelogItems { get; set; }
    public DbSet<ProjectMetric> ProjectMetrics { get; set; }
    public DbSet<ProjectComment> ProjectComments { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        
        // Soft delete global query filter
        builder.Entity<ExperienceEntry>().HasQueryFilter(x => !x.IsDeleted);
        builder.Entity<ProjectEntry>().HasQueryFilter(x => !x.IsDeleted);
        builder.Entity<BioEntry>().HasQueryFilter(x => !x.IsDeleted);
        builder.Entity<ServiceEntry>().HasQueryFilter(x => !x.IsDeleted);
        builder.Entity<BlogPost>().HasQueryFilter(x => !x.IsDeleted);
        builder.Entity<EducationEntry>().HasQueryFilter(x => !x.IsDeleted);
        builder.Entity<ContactMessage>().HasQueryFilter(x => !x.IsDeleted);
        builder.Entity<SkillEntry>().HasQueryFilter(x => !x.IsDeleted);
        builder.Entity<ProjectKeyFeature>().HasQueryFilter(x => !x.IsDeleted);
        builder.Entity<ProjectChangelogItem>().HasQueryFilter(x => !x.IsDeleted);
        builder.Entity<ProjectMetric>().HasQueryFilter(x => !x.IsDeleted);
        builder.Entity<ProjectComment>().HasQueryFilter(x => !x.IsDeleted);

        // Project Relationships
        builder.Entity<ProjectEntry>()
            .HasMany(p => p.KeyFeatures)
            .WithOne()
            .HasForeignKey(kf => kf.ProjectEntryId);

        builder.Entity<ProjectEntry>()
            .HasMany(p => p.Changelog)
            .WithOne()
            .HasForeignKey(cl => cl.ProjectEntryId);

        builder.Entity<ProjectEntry>()
            .HasMany(p => p.Metrics)
            .WithOne()
            .HasForeignKey(m => m.ProjectEntryId);

        builder.Entity<ProjectEntry>()
            .HasMany(p => p.Comments)
            .WithOne()
            .HasForeignKey(c => c.ProjectEntryId);
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
