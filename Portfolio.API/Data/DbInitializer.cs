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
                Name = "مصطفى سمير سعيد",
                Title = "مبتكر حلول برمجية",
                Description = "بناء المستقبل بالكود. متخصص في تقنيات الويب الحديثة وإنشاء تجارب رقمية استثنائية.",
                Location = "الغربية، مصر",
                Email = "m.ssaid356@gmail.com",
                Phone = "+20 106 735 8073",
                AvatarUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
            });
        }

        // Seed Services
        if (!context.ServiceEntries.Any())
        {
            context.ServiceEntries.AddRange(
                new ServiceEntry
                {
                    Title = "تطوير الواجهات الأمامية",
                    Description = "تعاونت مع فرق متعددة التخصصات لتسليم المشاريع قبل الموعد المحدد. قمت بتطوير مكونات واجهة مستخدم بديهية باستخدام Angular وأطر عمل JS الحديثة.",
                    Icon = "lucide-layout"
                },
                new ServiceEntry
                {
                    Title = "حلول إدارة المحتوى (CMS)",
                    Description = "خبير في صياغة حلول CMS سهلة الاستخدام تزيد من التفاعل. طبقت أفضل ممارسات تحسين محركات البحث (SEO) وقمت بتطوير إضافات مخصصة.",
                    Icon = "lucide-database"
                },
                new ServiceEntry
                {
                    Title = "منصات التجارة الإلكترونية",
                    Description = "بناء أسواق متكاملة قابلة للتوسع مثل Vengo Roll، تدعم قوائم البائعين المتعددين والمعاملات الآمنة.",
                    Icon = "lucide-shopping-cart"
                },
                new ServiceEntry
                {
                    Title = "الأنظمة الصحية",
                    Description = "تطوير أنظمة إدارة سريرية على مستوى المؤسسات لتبسيط سير العمل لرعاية المرضى وإدارة السجلات.",
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
