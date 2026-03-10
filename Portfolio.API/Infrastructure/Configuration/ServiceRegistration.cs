using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Portfolio.API.Data;
using Portfolio.API.Services;
using Portfolio.API.Repositories;

namespace Portfolio.API.Configuration;

public static class ServiceRegistration
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Database
        var connectionString = configuration.GetConnectionString("DefaultConnection") 
            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

        services.AddDbContext<PortfolioDbContext>(options =>
            options.UseSqlServer(connectionString));

        // Identity
        services.AddIdentityApiEndpoints<IdentityUser>()
            .AddEntityFrameworkStores<PortfolioDbContext>();

        // Core Services
        services.AddScoped<IConfigurationService, ConfigurationService>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<INotificationService, NotificationService>();
        services.AddScoped<IEmailService, EmailService>();

        // Feature Services
        services.AddScoped<Features.Projects.Services.IProjectService, Features.Projects.Services.ProjectService>();
        services.AddScoped<Features.Comments.Services.ICommentService, Features.Comments.Services.CommentService>();
        services.AddScoped<Features.Reactions.Services.IReactionService, Features.Reactions.Services.ReactionService>();

        // SignalR
        services.AddSignalR();

        // Health Checks
        services.AddHealthChecks()
            .AddDbContextCheck<PortfolioDbContext>();

        return services;
    }
}