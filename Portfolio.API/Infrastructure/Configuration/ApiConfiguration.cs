using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace Portfolio.API.Configuration;

public static class ApiConfiguration
{
    /// <summary>
    /// Configures MVC controllers, JSON serialization, API behavior, response caching, and Swagger services for the application.
    /// </summary>
    /// <remarks>
    /// - Enables controllers.
    /// - Configures JSON serialization to use camelCase property names and case-insensitive property matching.
    /// - Configures API behavior to log model validation failures (including request path and validation errors) and return a BadRequest result containing the ModelState.
    /// - Adds response caching for improved performance.
    /// - Registers Swagger generation services.
    /// </remarks>
    /// <returns>The modified <see cref="IServiceCollection"/> to allow fluent chaining.</returns>
    public static IServiceCollection AddApiConfiguration(this IServiceCollection services)
    {
        services.AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
                options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
            })
            .ConfigureApiBehaviorOptions(options =>
            {
                options.InvalidModelStateResponseFactory = context =>
                {
                    var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<Program>>();
                    var errors = context.ModelState
                        .Where(e => e.Value?.Errors.Count > 0)
                        .Select(e => new { Field = e.Key, Errors = e.Value?.Errors.Select(er => er.ErrorMessage) });
                    
                    logger.LogWarning("Model validation failed for {Path}. Errors: {Errors}", 
                        context.HttpContext.Request.Path, 
                        JsonSerializer.Serialize(errors));
                        
                    return new BadRequestObjectResult(context.ModelState);
                };
            });

        // Response caching for performance
        services.AddResponseCaching(options =>
        {
            options.MaximumBodySize = 1024 * 1024; // 1MB
            options.UseCaseSensitivePaths = false;
        });

        // Swagger
        services.AddSwaggerGen();

        return services;
    }
}