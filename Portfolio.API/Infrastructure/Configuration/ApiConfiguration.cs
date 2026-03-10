using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace Portfolio.API.Configuration;

public static class ApiConfiguration
{
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

        // Swagger
        services.AddSwaggerGen();

        return services;
    }
}