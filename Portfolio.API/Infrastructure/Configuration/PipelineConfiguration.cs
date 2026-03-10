using Portfolio.API.Endpoints;

namespace Portfolio.API.Configuration;

public static class PipelineConfiguration
{
    public static WebApplication ConfigurePipeline(this WebApplication app)
    {
        // Configure the HTTP request pipeline
        if (app.Environment.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }
        else
        {
            app.UseExceptionHandler("/Error");
            app.UseHsts();
        }

        // Basic middleware
        app.UseHttpsRedirection();
        app.UseStaticFiles();

        // Rate limiting
        app.UseRateLimiter();

        // CORS before authentication
        app.UseCors("AllowSpecificOrigins");

        // Authentication & Authorization
        app.UseAuthentication();
        app.UseAuthorization();

        // Configure OpenAPI/Swagger
        app.MapOpenApi();
        app.UseSwagger();
        app.UseSwaggerUI(options =>
        {
            options.SwaggerEndpoint("/openapi/v1.json", "Portfolio API v1");
            options.RoutePrefix = "swagger";
        });

        // Health checks
        app.MapHealthChecks("/health");

        // Redirect root to Swagger UI
        app.MapGet("/", () => Results.Redirect("/swagger"));

        // Map endpoints
        app.MapAuthenticationEndpoints();
        app.MapControllers().RequireRateLimiting("ApiPolicy");

        // SignalR Hub
        app.MapHub<Portfolio.API.Hubs.NotificationHub>("/hubs/notifications");

        return app;
    }
}