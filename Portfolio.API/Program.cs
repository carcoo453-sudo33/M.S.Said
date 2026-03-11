using Portfolio.API.Configuration;

// Configure Serilog
LoggingConfiguration.ConfigureSerilog();

var builder = WebApplication.CreateBuilder(args);

// Use Serilog
builder.Host.UseSerilogConfiguration();

// Add services
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddJwtAuthentication(builder.Configuration);
builder.Services.AddCorsConfiguration(builder.Configuration);
builder.Services.AddRateLimitingConfiguration();
builder.Services.AddApiConfiguration();

var app = builder.Build();

// Configure pipeline
app.ConfigurePipeline();

// Configure database
await app.ConfigureDatabaseAsync();

app.Run();
