using Microsoft.AspNetCore.Identity;
using Portfolio.API.Entities;
using Portfolio.API.Enums;

namespace Portfolio.API.Data;

public static class DbInitializer
{
    public static async Task Initialize(IServiceProvider serviceProvider)
    {
        var userManager = serviceProvider.GetRequiredService<UserManager<IdentityUser>>();
        var context = serviceProvider.GetRequiredService<PortfolioDbContext>();
        var configuration = serviceProvider.GetRequiredService<IConfiguration>();

        // Only seed if database is empty (no projects exist)
        if (context.Projects.Any())
        {
            return; // Database already has data, skip seeding
        }

        // Seed Admin User
        var adminEmail = configuration["AdminUser:Email"] ?? Environment.GetEnvironmentVariable("ADMIN_EMAIL");
        var adminPassword = configuration["AdminUser:Password"] ?? Environment.GetEnvironmentVariable("ADMIN_PASSWORD");
        
        if (string.IsNullOrEmpty(adminEmail) || string.IsNullOrEmpty(adminPassword))
        {
            throw new InvalidOperationException("Admin credentials must be provided via configuration or environment variables");
        }

        var user = await userManager.FindByEmailAsync(adminEmail);

        if (user == null)
        {
            user = new IdentityUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                EmailConfirmed = true
            };
            var result = await userManager.CreateAsync(user, adminPassword);
            if (!result.Succeeded)
            {
                throw new InvalidOperationException($"Failed to create admin user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }
        }

        // Seed Bio
        if (!context.Bios.Any())
        {
            context.Bios.Add(new Bio
            {
                Name = "Mostafa Samir Said",
                Title = "Full Stack Developer (.NET & Angular)",
                Description = "Innovative Fullstack Developer specializing in API integration, responsive design, and JavaScript frameworks.",
                Location = "Gharbia, Egypt",
                Email = "m.ssaid356@gmail.com",
                Phone = "01067358073",
                AvatarUrl = "https://ui-avatars.com/api/?name=Mostafa+Samir+Said&background=f20d0d&color=fff&size=512",
                LinkedInUrl = "https://www.linkedin.com/in/mostafasamirsaid",
                GitHubUrl = "https://github.com/Mostafa-SAID7",
                YearsOfExperience = "3+",
                ProjectsCompleted = "40+",
                CodeCommits = "12k"
            });
            await context.SaveChangesAsync();
        }

        // Seed Services
        if (!context.Services.Any())
        {
            context.Services.AddRange(
                new Service { Title = "Frontend Development", Description = "Angular and modern JS frameworks", Icon = "lucide-layout" },
                new Service { Title = "Backend Development", Description = "ASP.NET Core and APIs", Icon = "lucide-database" },
                new Service { Title = "Full Stack Solutions", Description = "End-to-end web applications", Icon = "lucide-code" }
            );
            await context.SaveChangesAsync();
        }

        // Seed Education
        if (!context.Education.Any())
        {
            context.Education.AddRange(
                new Education
                {
                    Institution = "Tanta University",
                    Degree = "Bachelor of Computer Engineering",
                    Duration = "2018 - 2023",
                    Description = "Software development and control systems",
                    Location = "Tanta, Egypt",
                    Category = EducationCategory.Education
                },
                new Education
                {
                    Institution = "MCIT",
                    Degree = "Full Stack Web Development",
                    Duration = "2023",
                    Description = "Professional diploma in web development",
                    Location = "Cairo, Egypt",
                    Category = EducationCategory.Training
                }
            );
            await context.SaveChangesAsync();
        }

        // Seed Projects
        if (!context.Projects.Any())
        {
            context.Projects.AddRange(
                new Project
                {
                    Title = "Portfolio CMS",
                    Slug = "portfolio-cms",
                    Description = "A fully self-managed portfolio content management system",
                    TechStack = "ASP.NET Core 9, Angular 19, SQL Server",
                    Category = ProjectCategory.FullStack,
                    Niche = "Developer Tools",
                    ImageUrl = "https://images.unsplash.com/photo-1547954575-855750c57bd3?w=1200&q=80",
                    Duration = "2025",
                    Status = ProjectStatus.Completed,
                    Type = ProjectType.Initial
                },
                new Project
                {
                    Title = "Clinic Management System",
                    Slug = "clinic-management-system",
                    Description = "Enterprise-grade clinical management platform",
                    TechStack = "ASP.NET Core, Angular, SQL Server",
                    Category = ProjectCategory.FullStack,
                    Niche = "Healthcare & MedTech",
                    ImageUrl = "https://images.unsplash.com/photo-1576091160550-217359f4b88c?w=1200&q=80",
                    Duration = "2024",
                    Status = ProjectStatus.Completed,
                    Type = ProjectType.Initial
                }
            );
            await context.SaveChangesAsync();
        }

        // Seed Skills
        if (!context.Skills.Any())
        {
            context.Skills.AddRange(
                new Skill { Name = "Angular", Icon = "lucide-angular", Order = 1 },
                new Skill { Name = ".NET", Icon = "lucide-dot-net", Order = 2 },
                new Skill { Name = "JavaScript", Icon = "lucide-javascript", Order = 3 },
                new Skill { Name = "SQL", Icon = "lucide-database", Order = 4 }
            );
            await context.SaveChangesAsync();
        }

        // Seed Clients
        if (!context.Clients.Any())
        {
            context.Clients.AddRange(
                new Client { Name = "WE3DS", LogoUrl = "/uploads/clients/we3ds.png", Order = 1 },
                new Client { Name = "Microsoft", LogoUrl = "/uploads/clients/microsoft.png", Order = 2 }
            );
            await context.SaveChangesAsync();
        }

        // Seed Testimonials
        if (!context.Testimonials.Any())
        {
            context.Testimonials.AddRange(
                new Testimonial
                {
                    Name = "Sarah Johnson",
                    Role = "Senior Product Manager",
                    Company = "TaskFlow Inc.",
                    Content = "Mostafa is an exceptional developer who consistently delivers high-quality code.",
                    AvatarUrl = "https://i.pravatar.cc/150?u=sarah",
                    Order = 1,
                    IsFeatured = true
                },
                new Testimonial
                {
                    Name = "Ahmed Hassan",
                    Role = "CTO",
                    Company = "WE3DS",
                    Content = "Working with Mostafa has been a game-changer for our development team.",
                    AvatarUrl = "https://i.pravatar.cc/150?u=ahmed",
                    Order = 2,
                    IsFeatured = true
                }
            );
            await context.SaveChangesAsync();
        }

        // Seed Blog Posts
        if (!context.BlogPosts.Any())
        {
            context.BlogPosts.AddRange(
                new BlogPost
                {
                    Title = "Optimizing .NET Core API Performance",
                    Summary = "Deep dive into optimizing API response times using Redis caching",
                    Content = "Decreasing latency by over 60% for read-heavy endpoints",
                    PublishedAt = DateTime.UtcNow.AddDays(-2),
                    Tags = "DotNet, Backend, Performance",
                    Author = "Mostafa Samir Said"
                },
                new BlogPost
                {
                    Title = "Why I switched from React to Angular",
                    Summary = "Angular's opinionated structure for enterprise applications",
                    Content = "Angular offers better consistency for large-scale enterprise applications",
                    PublishedAt = DateTime.UtcNow.AddDays(-5),
                    Tags = "Angular, Frontend, Architecture",
                    Author = "Mostafa Samir Said"
                }
            );
            await context.SaveChangesAsync();
        }

        await context.SaveChangesAsync();
    }
}
