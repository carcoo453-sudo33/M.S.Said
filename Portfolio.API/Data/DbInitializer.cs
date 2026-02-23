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

        // Seed Bio
        if (!context.BioEntries.Any())
        {
            context.BioEntries.Add(new BioEntry
            {
                Name = "Mostafa Samir Said",
                Title = "Full Stack Developer (.NET & Angular)",
                Description = "Innovative Fullstack Developer specializing in API integration, responsive design, and JavaScript frameworks. I deliver high-performance websites and applications, enhancing web accessibility and user experience. Experienced in project management and team leadership, with strong organizational and problem-solving skills.",
                Location = "Gharbia, Egypt",
                Email = "m.ssaid356@gmail.com",
                Phone = "01067358073",
                AvatarUrl = "https://ui-avatars.com/api/?name=Mostafa+Samir+Said&background=f20d0d&color=fff&size=512",
                LinkedInUrl = "https://linkedin.com/in/mostafasaid",
                GitHubUrl = "https://github.com/mssaid",
                WhatsAppUrl = "201067358073",
                CVUrl = "/cv.pdf",
                TwitterUrl = "https://twitter.com/mostafasaid",
                YearsOfExperience = "3+",
                ProjectsCompleted = "40+",
                CodeCommits = "12k"
            });
            await context.SaveChangesAsync();
        }

        // Seed Services
        if (!context.ServiceEntries.Any())
        {
            context.ServiceEntries.AddRange(
                new ServiceEntry
                {
                    Title = "Frontend Development",
                    Description = "Collaborated with cross-functional teams to deliver projects ahead of schedule. Developed intuitive UI components using Angular and modern JS frameworks.",
                    Icon = "lucide-layout"
                },
                new ServiceEntry
                {
                    Title = "CMS Solutions",
                    Description = "Expert in crafting user-friendly CMS solutions that drive engagement. Implemented SEO best practices and developed custom plugins.",
                    Icon = "lucide-database"
                },
                new ServiceEntry
                {
                    Title = "E-Commerce Platforms",
                    Description = "Building scalable full-stack marketplaces like Vengo Roll, supporting multi-vendor listings and secure transactions.",
                    Icon = "lucide-shopping-cart"
                },
                new ServiceEntry
                {
                    Title = "Healthcare Systems",
                    Description = "Developing enterprise-grade clinical management systems to streamline patient care workflows and record management.",
                    Icon = "lucide-activity"
                }
            );
        }

        // Seed Experience
        if (!context.Experiences.Any())
        {
            context.Experiences.AddRange(
                new ExperienceEntry
                {
                    Company = "WE3DS",
                    Role = "Frontend Developer",
                    Duration = "05/2024 - Present",
                    Description = "Drafted responsive web designs that boosted user engagement by 30%. Developed intuitive UI components increasing satisfaction.",
                    Location = "Tanta",
                    IsCurrent = true
                },
                new ExperienceEntry
                {
                    Company = "Remote",
                    Role = "CMS Web Developer",
                    Duration = "2023",
                    Description = "Implemented SEO best practices, enhancing search visibility significantly. Developed custom plugins increasing functionality.",
                    Location = "Saudi Arabia",
                    IsCurrent = false
                }
            );
        }

        // Seed Projects — clear stale entries missing slugs, then re-seed
        var sluglessProjects = context.Projects.Where(p => p.Slug == null || p.Slug == "").ToList();
        if (sluglessProjects.Any())
        {
            context.Projects.RemoveRange(sluglessProjects);
            await context.SaveChangesAsync();
        }

        if (!context.Projects.Any())
        {
            context.Projects.AddRange(
                new ProjectEntry
                {
                    Title = "Vengo Roll",
                    Slug = "vengo-roll",
                    Description = "A scalable full-stack multi-vendor marketplace platform engineered to support product listings, customer ordering workflows, and secure payment transactions. Built with a micro-service-inspired architecture to handle thousands of concurrent users.",
                    TechStack = "ASP.NET Core, Angular, SQL Server, Tailwind CSS, Stripe API",
                    Category = "E-Commerce",
                    Tags = "marketplace, multi-vendor, payments, fullstack",
                    Niche = "Retail & Commerce",
                    ImageUrl = "https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&q=80",
                    DemoUrl = "https://vengo-roll.example.com",
                    RepoUrl = "https://github.com/mssaid/vengo-roll",
                    Duration = "2024-2025"
                },
                new ProjectEntry
                {
                    Title = "Clinic Management System",
                    Slug = "clinic-management-system",
                    Description = "An enterprise-grade clinical management platform built to streamline patient care workflows. Enables healthcare professionals to manage appointments, patient records, prescriptions, and billing from a single unified dashboard.",
                    TechStack = "ASP.NET Core, Angular, SQL Server, Entity Framework Core, SignalR",
                    Category = "Healthcare",
                    Tags = "healthcare, enterprise, EHR, appointments, billing",
                    Niche = "Healthcare & MedTech",
                    ImageUrl = "https://images.unsplash.com/photo-1576091160550-217359f4b88c?w=1200&q=80",
                    DemoUrl = "https://clinic.example.com",
                    RepoUrl = "https://github.com/mssaid/clinic-management",
                    Duration = "2024"
                },
                new ProjectEntry
                {
                    Title = "Portfolio CMS",
                    Slug = "portfolio-cms",
                    Description = "A fully self-managed portfolio content management system with an admin dashboard, dynamic content sections, JWT-based authentication, and a headless API consumed by an Angular front-end. This very portfolio you're reading is built on it.",
                    TechStack = "ASP.NET Core 9, Angular 19, Tailwind CSS, EF Core, SQL Server, JWT",
                    Category = "Portfolio",
                    Tags = "portfolio, cms, fullstack, authentication, headless-api",
                    Niche = "Developer Tools",
                    ImageUrl = "https://images.unsplash.com/photo-1547954575-855750c57bd3?w=1200&q=80",
                    DemoUrl = "https://mostafasaid.dev",
                    RepoUrl = "https://github.com/mssaid/portfolio",
                    Duration = "2025",
                    Summary = "A premium personal portfolio CMS built with modern technologies.",
                    Language = "English",
                    Architecture = "N-Tier / Clean Architecture",
                    Status = "Active",
                    KeyFeatures = new List<ProjectKeyFeature>
                    {
                        new ProjectKeyFeature { Icon = "lucide-layout", Title = "Admin Dashboard", Description = "Full-featured dashboard for content management." },
                        new ProjectKeyFeature { Icon = "lucide-shield", Title = "JWT Auth", Description = "Secure authentication using JSON Web Tokens." }
                    }
                },
                new ProjectEntry
                {
                    Title = "Task Flow",
                    Slug = "task-flow",
                    Description = "A real-time collaborative project management tool with Kanban boards, drag-and-drop task cards, team workspaces, and live-update notifications powered by SignalR. Designed for small agile teams.",
                    TechStack = "ASP.NET Core, Angular, SignalR, SQL Server, Tailwind CSS",
                    Category = "Productivity",
                    Tags = "project-management, kanban, real-time, signalr, teams",
                    Niche = "SaaS & Productivity",
                    ImageUrl = "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200&q=80",
                    DemoUrl = "https://taskflow.example.com",
                    RepoUrl = "https://github.com/mssaid/task-flow",
                    Duration = "2024"
                }
            );
        }


        // Seed Education
        if (!context.EducationEntries.Any())
        {
            context.EducationEntries.AddRange(
                new EducationEntry
                {
                    Institution = "Tanta University",
                    Degree = "B.Sc. in Computer Engineering & Automatic Control",
                    Duration = "2018 - 2023",
                    Description = "Specialized in software development and intelligent systems architecture.",
                    Location = "Tanta, Egypt"
                },
                new EducationEntry
                {
                    Institution = "Ministry of Communications and Information Technology (MCIT)",
                    Degree = "Full Stack Web Developer Diploma",
                    Duration = "2023",
                    Description = "Intensive training on MERN stack and ASP.NET Core advanced architectures.",
                    Location = "Cairo, Egypt"
                }
            );
        }

        // Seed Blog
        if (!context.BlogPosts.Any())
        {
            context.BlogPosts.AddRange(
                new BlogPost
                {
                    Title = "Optimizing .NET Core API Performance",
                    Summary = "Just wrapped up a deep dive into optimizing API response times using Redis caching in .NET 8. The results were staggering—decreasing latency by over 60% for read-heavy endpoints.",
                    Content = "Just wrapped up a deep dive into optimizing API response times using Redis caching in .NET 8. The results were staggering—decreasing latency by over 60% for read-heavy endpoints. Swipe to see the architecture diagram!",
                    PublishedAt = DateTime.UtcNow.AddDays(-2),
                    Tags = "DotNet, Backend, Performance",
                    ImageUrl = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80",
                    SocialType = "LinkedIn",
                    SocialUrl = "https://linkedin.com/posts/mostafasaid",
                    LikesCount = 142,
                    CommentsCount = 24,
                    Author = "Mostafa Samir Said"
                },
                new BlogPost
                {
                    Title = "Why I switched from React to Angular for Enterprise Apps",
                    Summary = "Controversial opinion maybe? While React offers incredible flexibility, Angular's opinionated structure and built-in dependency injection make it a powerhouse for large-scale enterprise applications.",
                    Content = "Controversial opinion maybe? While React offers incredible flexibility, Angular's opinionated structure and built-in dependency injection make it a powerhouse for large-scale enterprise applications where consistency is key. Here are my top 5 reasons why...",
                    PublishedAt = DateTime.UtcNow.AddDays(-5),
                    Tags = "Angular, Frontend, Architecture",
                    SocialType = "Dev.to",
                    SocialUrl = "https://dev.to/mostafasaid",
                    LikesCount = 56,
                    CommentsCount = 8,
                    Author = "Mostafa Samir Said",
                    ImageUrl = "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=1200&q=80"
                },
                new BlogPost
                {
                    Title = "Release v2.0.4: Clinic Management System",
                    Summary = "Major update rolled out for the CMS project. Included patch for patient data encryption module and optimized the appointment scheduler algorithm.",
                    Content = "Major update rolled out for the CMS project. Included patch for patient data encryption module and optimized the appointment scheduler algorithm.\n\n```bash\ngit commit -m \"fix: enhanced encryption for patient records\"\ngit push origin master\n```",
                    PublishedAt = DateTime.UtcNow.AddDays(-7),
                    Tags = "Release, Security, Healthcare",
                    SocialType = "GitHub",
                    SocialUrl = "https://github.com/mssaid/clinic-management",
                    StarsCount = 24,
                    ForksCount = 5,
                    Version = "v2.0.4",
                    Author = "Mostafa Samir Said"
                },
                new BlogPost
                {
                    Title = "Vengo Roll Marketplace Case Study",
                    Summary = "Proud to share the design system I built for the Vengo Roll marketplace platform. We focused on high-contrast accessibility and mobile-first navigation.",
                    Content = "Proud to share the design system I built for the Vengo Roll marketplace platform. We focused on high-contrast accessibility and mobile-first navigation.",
                    PublishedAt = DateTime.UtcNow.AddDays(-14),
                    Tags = "Design, ECommerce, UX",
                    ImageUrl = "https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&q=80",
                    SocialType = "LinkedIn",
                    SocialUrl = "https://linkedin.com/posts/mostafasaid-vengo",
                    LikesCount = 89,
                    CommentsCount = 0,
                    Author = "Mostafa Samir Said"
                }
            );
        }

        // Seed Skills
        if (!context.Skills.Any())
        {
            context.Skills.AddRange(
                new SkillEntry { Name = "Angular", Icon = "lucide-angular", Order = 1 },
                new SkillEntry { Name = ".NET", Icon = "lucide-dot-net", Order = 2 },
                new SkillEntry { Name = "JS", Icon = "lucide-javascript", Order = 3 },
                new SkillEntry { Name = "SQL", Icon = "lucide-database", Order = 4 },
                new SkillEntry { Name = "HTML5", Icon = "lucide-html5", Order = 5 },
                new SkillEntry { Name = "CSS3", Icon = "lucide-css3", Order = 6 }
            );
        }

        await context.SaveChangesAsync();
    }
}
