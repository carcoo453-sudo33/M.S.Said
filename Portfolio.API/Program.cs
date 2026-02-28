using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.API.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
builder.Services.AddDbContext<PortfolioDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddIdentityApiEndpoints<IdentityUser>()
    .AddEntityFrameworkStores<PortfolioDbContext>();

// CORS configuration - Allow all origins
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

// Register Unit of Work
builder.Services.AddScoped<Portfolio.API.Repositories.IUnitOfWork, Portfolio.API.Repositories.UnitOfWork>();

// Register Notification Service
builder.Services.AddScoped<Portfolio.API.Services.INotificationService, Portfolio.API.Services.NotificationService>();

// Register Email Service
builder.Services.AddScoped<Portfolio.API.Services.IEmailService, Portfolio.API.Services.EmailService>();

// Register SignalR
builder.Services.AddSignalR();

// Standard .NET 9 OpenAPI configuration
builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Add middleware to handle OPTIONS requests explicitly for CORS preflight
app.Use(async (context, next) =>
{
    if (context.Request.Method == "OPTIONS")
    {
        context.Response.Headers.Add("Access-Control-Allow-Origin", "*");
        context.Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
        context.Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept, X-Requested-With");
        context.Response.Headers.Add("Access-Control-Max-Age", "86400");
        context.Response.StatusCode = 200;
        await context.Response.CompleteAsync();
        return;
    }
    await next();
});

// CORS MUST be at the very top - before any other middleware
app.UseCors("AllowAngular");

// Serve static files from wwwroot (includes uploads folder)
app.UseStaticFiles();

// Configure the HTTP request pipeline.
app.MapOpenApi();
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/openapi/v1.json", "Portfolio API v1");
    options.RoutePrefix = "swagger";
});

// Redirect root to Swagger UI
app.MapGet("/", () => Results.Redirect("/swagger"));

app.UseAuthentication();
app.UseAuthorization();

// Map only login endpoint - removed all other identity endpoints
app.MapPost("/identity/login", async (SignInManager<IdentityUser> signInManager, [FromBody] LoginRequest login) =>
{
    signInManager.AuthenticationScheme = IdentityConstants.BearerScheme;
    var result = await signInManager.PasswordSignInAsync(login.Email, login.Password, false, lockoutOnFailure: false);
    
    if (!result.Succeeded)
    {
        return Results.Unauthorized();
    }
    
    return Results.Empty;
}).AllowAnonymous().RequireCors("AllowAngular");

app.MapControllers().RequireCors("AllowAngular");

// Map SignalR Hub - must be after UseCors
app.MapHub<Portfolio.API.Hubs.NotificationHub>("/hubs/notifications").RequireCors("AllowAngular");

// Seeding logic
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<PortfolioDbContext>();
        context.Database.Migrate();
        
        // Add RepliesJson column if it doesn't exist
        try
        {
            await context.Database.ExecuteSqlRawAsync(@"
                IF NOT EXISTS (
                    SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_NAME = 'ProjectComments' 
                    AND COLUMN_NAME = 'RepliesJson'
                )
                BEGIN
                    ALTER TABLE ProjectComments ADD RepliesJson NVARCHAR(MAX) NULL;
                END
            ");
            Console.WriteLine("RepliesJson column check/creation completed");
        }
        catch (Exception colEx)
        {
            Console.WriteLine($"Column creation warning (may already exist): {colEx.Message}");
        }
        
        await DbInitializer.Initialize(services);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while migrating or seeding the database.");
    }
}

app.Run();

// Login request model
public record LoginRequest(string Email, string Password);
