using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Portfolio.API.Data;
using Portfolio.API.Services;
using Portfolio.API.Repositories;
using Portfolio.API.Application.Features.Bio.Services;
using Portfolio.API.Application.Features.Blog.Services;
using Portfolio.API.Application.Features.Categories.Services;
using Portfolio.API.Application.Features.Contact.Services;
using Portfolio.API.Application.Features.Education.Services;
using Portfolio.API.Application.Features.Experiences.Services;
using Portfolio.API.Application.Features.Niches.Services;
using Portfolio.API.Application.Features.Notifications.Services;
using Portfolio.API.Application.Features.Projects.Services;
using Portfolio.API.Application.Features.References.Services;
using Portfolio.API.Application.Features.Services.Services;
using Portfolio.API.Application.Features.Skills.Services;
using Portfolio.API.Application.Features.Comments.Services;
using Portfolio.API.Application.Features.Reactions.Services;
using Portfolio.API.Application.Features.Auth.Services;
using INotificationService = Portfolio.API.Application.Features.Notifications.Services.INotificationService;
using NotificationService = Portfolio.API.Application.Features.Notifications.Services.NotificationService;
using Portfolio.API.Application.Features.Projects.Queries;

namespace Portfolio.API.Configuration;

public static class ServiceRegistration
{
    /// <summary>
    /// Registers application-wide infrastructure and feature services, database context, identity, SignalR, global exception handling, ProblemDetails, and health checks into the provided service collection.
    /// </summary>
    /// <param name="configuration">Application configuration; must contain a connection string named "DefaultConnection".</param>
    /// <returns>The same <see cref="IServiceCollection"/> instance with services registered.</returns>
    /// <exception cref="InvalidOperationException">Thrown when the "DefaultConnection" connection string is not found in <paramref name="configuration"/>.</exception>
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Database
        var connectionString = configuration.GetConnectionString("DefaultConnection") 
            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

        services.AddDbContext<PortfolioDbContext>(options =>
            options.UseSqlServer(connectionString, o => 
                o.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery)));

        // Identity
        services.AddIdentityApiEndpoints<IdentityUser>()
            .AddEntityFrameworkStores<PortfolioDbContext>();

        // Core Services
        services.AddScoped<IConfigurationService, ConfigurationService>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<INotificationService, NotificationService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddHttpClient();
        services.AddMemoryCache();

        // Feature Services
        services.AddScoped<IBioService, BioService>();
        services.AddScoped<IBlogService, BlogService>();
        services.AddScoped<ICategoryService, CategoryService>();
        services.AddScoped<IContactService, ContactService>();
        services.AddScoped<IEducationService, EducationService>();
        services.AddScoped<IExperienceService, ExperienceService>();
        services.AddScoped<INicheService, NicheService>();
        services.AddScoped<IProjectService, ProjectService>();
        services.AddScoped<GetProjectsQueryHandler>();
        services.AddScoped<GetProjectBySlugQueryHandler>();
        services.AddScoped<GetFeaturedProjectsQueryHandler>();
        services.AddScoped<GetRelatedProjectsQueryHandler>();
        services.AddScoped<SlugExistsQueryHandler>();
        services.AddScoped<IReferenceService, ReferenceService>();
        services.AddScoped<IServiceService, ServiceService>();
        services.AddScoped<ISkillService, SkillService>();
        services.AddScoped<ICommentService, CommentService>();
        services.AddScoped<IReactionService, ReactionService>();

        // SignalR
        services.AddSignalR();

        // Global Exception Handler
        services.AddExceptionHandler<Portfolio.API.Infrastructure.Middlewares.GlobalExceptionHandler>();
        services.AddProblemDetails();

        // Health Checks
        services.AddHealthChecks();

        return services;
    }
}