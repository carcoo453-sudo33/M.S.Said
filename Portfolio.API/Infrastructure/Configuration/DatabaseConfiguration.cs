using Microsoft.EntityFrameworkCore;
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
            
            // Initialize seed data
            await DbInitializer.Initialize(services);
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
            ("ProjectComments", "RepliesJson", "NVARCHAR(MAX) NULL"),
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
            ("ProjectKeyFeatures", "Title_Ar", "NVARCHAR(500) NULL"),
            ("ProjectKeyFeatures", "Description_Ar", "NVARCHAR(MAX) NULL"),
            ("ProjectChangelogs", "Title_Ar", "NVARCHAR(500) NULL"),
            ("ProjectChangelogs", "Description_Ar", "NVARCHAR(MAX) NULL")
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
            // Use parameterized query to prevent SQL injection
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
            Console.WriteLine($"{table}.{column} column check/creation completed");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Column creation warning ({table}.{column}): {ex.Message}");
        }
    }
}