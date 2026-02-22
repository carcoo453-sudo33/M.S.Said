using Microsoft.AspNetCore.Identity;
using Portfolio.API.Entities;

namespace Portfolio.API.Data;

public static class DbInitializer
{
    public static async Task Initialize(IServiceProvider serviceProvider)
    {
        var userManager = serviceProvider.GetRequiredService<UserManager<IdentityUser>>();
        var context = serviceProvider.GetRequiredService<PortfolioDbContext>();

        // Seed Admin User
        var adminEmail = "m.ssaid356@gmail.com";
        var user = await userManager.FindByEmailAsync(adminEmail);

        if (user == null)
        {
            user = new IdentityUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                EmailConfirmed = true
            };
            await userManager.CreateAsync(user, "Memo@3560");
        }

        // Seed Experience
        if (!context.Experiences.Any())
        {
            context.Experiences.AddRange(
                new ExperienceEntry
                {
                    Company = "Google Stitch Labs",
                    Role = "Full Stack Developer",
                    Duration = "2023 - Present",
                    Description = "Leading the development of experimental UI generation tools.",
                    Location = "Tech City, CA",
                    IsCurrent = true
                },
                new ExperienceEntry
                {
                    Company = "Creative Solutions",
                    Role = "Frontend Engineer",
                    Duration = "2021 - 2023",
                    Description = "Developed highly interactive web applications using Angular.",
                    Location = "Remote",
                    IsCurrent = false
                }
            );
        }

        // Seed Projects
        if (!context.Projects.Any())
        {
            context.Projects.AddRange(
                new ProjectEntry
                {
                    Title = "Work Experience Timeline",
                    Description = "A modern interactive timeline for portfolio sites.",
                    TechStack = "Angular, .NET 9, SQL Server",
                    ImageUrl = "https://images.unsplash.com/photo-1512295767273-ac109ac3acdf"
                }
            );
        }

        await context.SaveChangesAsync();
    }
}
