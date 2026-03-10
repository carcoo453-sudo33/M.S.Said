using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Portfolio.API.Data;

namespace Portfolio.API.Configuration;

public static class DatabaseConfiguration
{
    public static async Task ConfigureDatabaseAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var services = scope.ServiceProvider;
        
        try
        {
            var context = services.GetRequiredService<PortfolioDbContext>();
            
            // Only run migrations automatically in development
            if (app.Environment.IsDevelopment())
            {
                context.Database.Migrate();
            }
            
            // Apply database schema updates
            await ApplySchemaUpdatesAsync(context);
            
            // Seed admin user
            await SeedAdminUserAsync(services);
        }
        catch (Exception ex)
        {
            var logger = services.GetRequiredService<ILogger<Program>>();
            logger.LogError(ex, "An error occurred while migrating or seeding the database.");
        }
    }

    private static async Task ApplySchemaUpdatesAsync(PortfolioDbContext context)
    {
        var schemaUpdates = new[]
        {
            ("Comments", "RepliesJson", "NVARCHAR(MAX) NULL"),
            ("Projects", "Views", "INT NOT NULL DEFAULT 0"),
            ("Projects", "IsFeatured", "BIT NOT NULL DEFAULT 0"),
            ("Projects", "GalleryJson", "NVARCHAR(MAX) NULL"),
            ("Projects", "ResponsibilitiesJson", "NVARCHAR(MAX) NULL"),
            ("Projects", "ReactionsCount", "INT NOT NULL DEFAULT 0")
        };

        foreach (var (table, column, columnType) in schemaUpdates)
        {
            await AddColumnIfNotExistsAsync(context, table, column, columnType);
        }

        // Add Arabic translation columns
        var translationColumns = new[]
        {
            ("Projects", "Title_Ar", "NVARCHAR(500) NULL"),
            ("Projects", "Description_Ar", "NVARCHAR(MAX) NULL"),
            ("Projects", "Summary_Ar", "NVARCHAR(MAX) NULL"),
            ("Projects", "Category_Ar", "NVARCHAR(200) NULL"),
            ("Projects", "Tags_Ar", "NVARCHAR(500) NULL"),
            ("Projects", "Niche_Ar", "NVARCHAR(200) NULL"),
            ("Projects", "Company_Ar", "NVARCHAR(200) NULL"),
            ("Projects", "Duration_Ar", "NVARCHAR(100) NULL"),
            ("Projects", "Language_Ar", "NVARCHAR(100) NULL"),
            ("Projects", "Architecture_Ar", "NVARCHAR(200) NULL"),
            ("Projects", "Status_Ar", "NVARCHAR(100) NULL"),
            ("KeyFeatures", "Title_Ar", "NVARCHAR(500) NULL"),
            ("KeyFeatures", "Description_Ar", "NVARCHAR(MAX) NULL"),
            ("ChangelogItems", "Title_Ar", "NVARCHAR(500) NULL"),
            ("ChangelogItems", "Description_Ar", "NVARCHAR(MAX) NULL")
        };

        foreach (var (table, column, columnType) in translationColumns)
        {
            await AddColumnIfNotExistsAsync(context, table, column, columnType);
        }
    }

    private static async Task AddColumnIfNotExistsAsync(PortfolioDbContext context, string table, string column, string columnType)
    {
        try
        {
            // Note: Table/column names cannot be parameterized in SQL.
            // Values are safe here as they come from hardcoded arrays within this class.
            var sql = $@"
                IF NOT EXISTS (
                    SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_NAME = '{table}' 
                    AND COLUMN_NAME = '{column}'
                )
                BEGIN
                    ALTER TABLE [{table}] ADD [{column}] {columnType};
                END
            ";
            
            await context.Database.ExecuteSqlRawAsync(sql);            Console.WriteLine($"{table}.{column} column check/creation completed");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Column creation warning ({table}.{column}): {ex.Message}");
        }
    }

    private static async Task SeedAdminUserAsync(IServiceProvider services)
    {
        var userManager = services.GetRequiredService<UserManager<IdentityUser>>();
        var logger = services.GetRequiredService<ILogger<Program>>();
        var configuration = services.GetRequiredService<IConfiguration>();

        try
        {
            var adminEmail = configuration["AdminUser:Email"];
            var adminPassword = configuration["AdminUser:Password"];

            if (string.IsNullOrEmpty(adminEmail) || string.IsNullOrEmpty(adminPassword))
            {
                logger.LogWarning("Admin credentials not configured. Skipping admin user seeding.");
                return;
            }

            var existingUser = await userManager.FindByEmailAsync(adminEmail);
            if (existingUser == null)
            {
                var adminUser = new IdentityUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(adminUser, adminPassword);
                if (result.Succeeded)
                {
                    logger.LogInformation("Admin user created successfully: {Email}", adminEmail);
                }
                else
                {
                    logger.LogError("Failed to create admin user. Errors: {Errors}", 
                        string.Join(", ", result.Errors.Select(e => e.Description)));
                }
            }
            else
            {
                logger.LogInformation("Admin user already exists: {Email}", adminEmail);
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error seeding admin user");
        }
    }
}
