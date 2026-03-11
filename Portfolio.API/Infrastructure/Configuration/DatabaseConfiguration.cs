using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Portfolio.API.Data;

namespace Portfolio.API.Configuration;

public static class DatabaseConfiguration
{
    /// <summary>
    /// Configures the application's database: creates a scope, runs EF migrations in the Development environment, applies schema updates, and seeds an admin user if configured.
    /// </summary>
    /// <param name="app">The WebApplication instance to configure.</param>
    /// <returns>A task that completes when database configuration, schema updates, and admin seeding have finished.</returns>
    public static async Task ConfigureDatabaseAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var services = scope.ServiceProvider;
        
        var logger = services.GetRequiredService<ILogger<Program>>();
        try
        {
            var context = services.GetRequiredService<PortfolioDbContext>();
            
            // Only run migrations automatically in development
            if (app.Environment.IsDevelopment())
            {
                context.Database.Migrate();
            }
            
            // Apply database schema updates
            await ApplySchemaUpdatesAsync(context, logger);
            
            // Seed admin user
            await SeedAdminUserAsync(services, logger);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while migrating or seeding the database.");
        }
    }

    /// <summary>
    /// Ensures required columns for the application's schema exist on the database and adds Arabic translation columns when missing.
    /// </summary>
    /// <param name="context">The <see cref="PortfolioDbContext"/> used to inspect and modify the database schema.</param>
    /// <param name="logger">Logger used to record informational and warning messages about applied schema changes.</param>
    private static async Task ApplySchemaUpdatesAsync(PortfolioDbContext context, ILogger logger)
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
            await AddColumnIfNotExistsAsync(context, table, column, columnType, logger);
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
            await AddColumnIfNotExistsAsync(context, table, column, columnType, logger);
        }
    }

    /// <summary>
    /// Ensures a column with the specified name and type exists on the given table, adding it if missing.
    /// </summary>
    /// <param name="context">The database context used to execute the schema change.</param>
    /// <param name="table">The target table name (expected to be a hardcoded, trusted identifier).</param>
    /// <param name="column">The column name to ensure exists on the table.</param>
    /// <param name="columnType">The SQL column type definition to use when adding the column (for example, "nvarchar(256)" or "int").</param>
    /// <param name="logger">A logger instance used to record success or warning messages.</param>
    private static async Task AddColumnIfNotExistsAsync(PortfolioDbContext context, string table, string column, string columnType, ILogger logger)
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
            
            await context.Database.ExecuteSqlRawAsync(sql);
            logger.LogInformation("{Table}.{Column} column check/creation completed", table, column);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Column creation warning ({Table}.{Column}): {Message}", table, column, ex.Message);
        }
    }

    /// <summary>
    /// Seeds an administrator Identity user using credentials from configuration when configured and not already present.
    /// </summary>
    /// <remarks>
    /// Reads "AdminUser:Email" and "AdminUser:Password" from the application's configuration. If both values are present and no user with that email exists, creates the user with EmailConfirmed set to true and logs the result; if credentials are missing or the user already exists, logs an appropriate message.
    /// </remarks>
    private static async Task SeedAdminUserAsync(IServiceProvider services, ILogger logger)
    {
        var userManager = services.GetRequiredService<UserManager<IdentityUser>>();
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
