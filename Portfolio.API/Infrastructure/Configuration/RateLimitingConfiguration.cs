using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;

namespace Portfolio.API.Configuration;

public static class RateLimitingConfiguration
{
    public static IServiceCollection AddRateLimitingConfiguration(this IServiceCollection services)
    {
        services.AddRateLimiter(options =>
        {
            options.AddFixedWindowLimiter("ApiPolicy", configure =>
            {
                configure.PermitLimit = 100;
                configure.Window = TimeSpan.FromMinutes(1);
                configure.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
                configure.QueueLimit = 10;
            });
            
            options.AddFixedWindowLimiter("AuthPolicy", configure =>
            {
                configure.PermitLimit = 5;
                configure.Window = TimeSpan.FromMinutes(1);
                configure.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
                configure.QueueLimit = 2;
            });
        });

        return services;
    }
}