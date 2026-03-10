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
using Portfolio.API.Application.Features.Skills.Services;
using Portfolio.API.Application.Features.Comments.Services;
using Portfolio.API.Application.Features.Reactions.Services;
using Portfolio.API.Application.Features.Auth.Services;
using INotificationService = Portfolio.API.Application.Features.Notifications.Services.INotificationService;
using NotificationService = Portfolio.API.Application.Features.Notifications.Services.NotificationService;

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
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<INotificationService, NotificationService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddHttpClient();

        // Feature Services
        services.AddScoped<IBioService, BioService>();
        services.AddScoped<IBlogService, BlogService>();
        services.AddScoped<ICategoryService, CategoryService>();
        services.AddScoped<IContactService, ContactService>();
        services.AddScoped<IEducationService, EducationService>();
        services.AddScoped<IExperienceService, ExperienceService>();
        services.AddScoped<INicheService, NicheService>();
        services.AddScoped<IProjectService, ProjectService>();
        services.AddScoped<IReferenceService, ReferenceService>();
        services.AddScoped<ISkillService, SkillService>();
        services.AddScoped<ICommentService, CommentService>();
        services.AddScoped<IReactionService, ReactionService>();

        // SignalR
        services.AddSignalR();

        // Health Checks
        services.AddHealthChecks();

        return services;
    }
}