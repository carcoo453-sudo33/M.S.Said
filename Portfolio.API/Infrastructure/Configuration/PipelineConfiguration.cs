using Serilog;

namespace Portfolio.API.Configuration;

public static class PipelineConfiguration
{
    /// <summary>
    /// Configures the application's HTTP request pipeline including error handling, HTTPS redirection, static files, response caching, rate limiting, CORS, authentication and authorization, health checks, controller endpoints, and SignalR hubs; exposes Swagger UI only in Development or Testing environments.
    /// </summary>
    /// <returns>The same <see cref="WebApplication"/> instance after middleware, endpoints, and hubs have been configured.</returns>
    public static WebApplication ConfigurePipeline(this WebApplication app)
    {
        // Use Serilog request logging to suppress verbose default logs and provide clean, single-line summaries.
        app.UseSerilogRequestLogging(options =>
        {
            options.MessageTemplate = "HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed:0.0000} ms";
        });

        // Configure the HTTP request pipeline
        app.UseExceptionHandler();

        if (app.Environment.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }
        else
        {
            app.UseHsts();
        }

        // Basic middleware
        app.UseHttpsRedirection();
        app.UseStaticFiles();
        
        // Response caching for performance
        app.UseResponseCaching();

        // Rate limiting
        app.UseRateLimiter();

        // CORS before authentication
        app.UseCors("AllowSpecificOrigins");

        // Authentication & Authorization
        app.UseAuthentication();
        app.UseAuthorization();

        // Swagger (development and testing)
        if (app.Environment.IsDevelopment() || app.Environment.IsEnvironment("Testing"))
        {
            app.UseSwagger();
            app.UseSwaggerUI(options =>
            {
                options.SwaggerEndpoint("/swagger/v1/swagger.json", "Portfolio API v1");
                options.RoutePrefix = "swagger";
            });
        }
        // Health checks
        app.MapHealthChecks("/health");

        // Redirect root to Swagger UI
        app.MapGet("/", () => Results.Redirect("/swagger"));

        // Map endpoints
        app.MapControllers().RequireRateLimiting("ApiPolicy");

        // SignalR Hub
        app.MapHub<Portfolio.API.Hubs.NotificationHub>("/hubs/notifications");

        return app;
    }
}