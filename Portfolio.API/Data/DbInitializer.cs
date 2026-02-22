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
                AvatarUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
                YearsOfExperience = "3+",
                ProjectsCompleted = "40+",
                CodeCommits = "12k"
            });
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

        // Seed Projects
        if (!context.Projects.Any())
        {
            context.Projects.AddRange(
                new ProjectEntry
                {
                    Title = "Vengo Roll",
                    Description = "A scalable full-stack marketplace platform engineered to support multi-vendor product listings, customer ordering workflows, and secure transaction...",
                    TechStack = "Marketplace, Full Stack",
                    ImageUrl = "https://images.unsplash.com/photo-1557821552-17105176677c",
                    Duration = "2024-2025"
                },
                new ProjectEntry
                {
                    Title = "Clinic Management System",
                    Description = "A full-stack, enterprise-grade clinical management system built to streamline patient care workflows. Enables healthcare professionals to manage patients...",
                    TechStack = "Healthcare, Enterprise",
                    ImageUrl = "https://images.unsplash.com/photo-1576091160550-217359f4b88c",
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
                    Institution = "جامعة طنطا",
                    Degree = "بكالوريوس هندسة الحاسبات والتحكم الآلي",
                    Duration = "2018 - 2023",
                    Description = "تخصصت في تطوير البرمجيات والأنظمة الذكية.",
                    Location = "طنطا، مصر"
                },
                new EducationEntry
                {
                    Institution = "وزارة الاتصالات وتكنولوجيا المعلومات",
                    Degree = "دبلوم مطور ويب متكامل",
                    Duration = "2023",
                    Description = "تدريب مكثف على تقنيات MERN stack و ASP.NET Core.",
                    Location = "القاهرة، مصر"
                }
            );
        }

        // Seed Blog
        if (!context.BlogPosts.Any())
        {
            context.BlogPosts.AddRange(
                new BlogPost
                {
                    Title = "مستقبل تطوير الويب باستخدام AI",
                    Summary = "كيف يغير الذكاء الاصطناعي طريقة كتابة الكود وبناء المواقع في 2024.",
                    Content = "الذكاء الاصطناعي لم يعد مجرد رفاهية، بل أصبح أداة أساسية في ترسانة المطور الحديث...",
                    PublishedAt = DateTime.UtcNow.AddDays(-10),
                    Tags = "AI, WebDev, Future",
                    ImageUrl = "https://images.unsplash.com/photo-1677442136019-21780ecad995"
                },
                new BlogPost
                {
                    Title = "لماذا Angular هي الخيار الأفضل للمشاريع الكبيرة؟",
                    Summary = "نظرة متعمقة على هندسة Angular وقوتها في بناء واجهات معقدة.",
                    Content = "تتميز Angular ببنية صارمة ومنظمة تساعد الفرق الكبيرة على التعاون...",
                    PublishedAt = DateTime.UtcNow.AddDays(-5),
                    Tags = "Angular, Frontend, Architecture",
                    ImageUrl = "https://images.unsplash.com/photo-1593720213428-28a5b9e94613"
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
