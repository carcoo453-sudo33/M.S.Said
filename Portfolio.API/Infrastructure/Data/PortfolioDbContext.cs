using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Portfolio.API.Entities;

namespace Portfolio.API.Data;

public class PortfolioDbContext : IdentityDbContext
{
    public PortfolioDbContext(DbContextOptions<PortfolioDbContext> options) : base(options)
    {
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);
        // Suppress pending model changes warning temporarily
        optionsBuilder.ConfigureWarnings(warnings => 
            warnings.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning));
    }

    public DbSet<Project> Projects { get; set; }
    public DbSet<Bio> Bios { get; set; }
    public DbSet<Service> Services { get; set; }
    public DbSet<Education> Education { get; set; }
    public DbSet<Skill> Skills { get; set; }
    public DbSet<Reference> References { get; set; }
    public DbSet<KeyFeature> KeyFeatures { get; set; }
    public DbSet<ChangelogItem> ChangelogItems { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<Reaction> Reactions { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Niche> Niches { get; set; }
    public DbSet<BlogPost> BlogPosts { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        
        // Soft delete global query filter
        builder.Entity<Project>().HasQueryFilter(x => !x.IsDeleted);
        builder.Entity<Bio>().HasQueryFilter(x => !x.IsDeleted);
        builder.Entity<Service>().HasQueryFilter(x => !x.IsDeleted);
        builder.Entity<Education>().HasQueryFilter(x => !x.IsDeleted);
        builder.Entity<Skill>().HasQueryFilter(x => !x.IsDeleted);
        builder.Entity<Reference>().HasQueryFilter(x => !x.IsDeleted);
        builder.Entity<KeyFeature>().HasQueryFilter(x => !x.IsDeleted);
        builder.Entity<ChangelogItem>().HasQueryFilter(x => !x.IsDeleted);
        builder.Entity<Comment>().HasQueryFilter(x => !x.IsDeleted);
        builder.Entity<Reaction>().HasQueryFilter(x => !x.IsDeleted);
        builder.Entity<Notification>().HasQueryFilter(x => !x.IsDeleted);
        builder.Entity<Category>().HasQueryFilter(x => !x.IsDeleted);
        builder.Entity<Niche>().HasQueryFilter(x => !x.IsDeleted);

        // Project Relationships
        builder.Entity<Project>()
            .HasMany(p => p.KeyFeatures)
            .WithOne()
            .HasForeignKey(kf => kf.ProjectId);

        builder.Entity<Project>()
            .HasMany(p => p.Changelog)
            .WithOne()
            .HasForeignKey(cl => cl.ProjectId);

        builder.Entity<Project>()
            .HasMany(p => p.Comments)
            .WithOne()
            .HasForeignKey(c => c.ProjectId);

        builder.Entity<Project>()
            .HasMany(p => p.Reactions)
            .WithOne()
            .HasForeignKey(r => r.ProjectId);
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
