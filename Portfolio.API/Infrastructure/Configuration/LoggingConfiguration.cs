using Serilog;
using Serilog.Events;

namespace Portfolio.API.Configuration;

public static class LoggingConfiguration
{
    public static void ConfigureSerilog()
    {
        Log.Logger = new LoggerConfiguration()
            .MinimumLevel.Information()
            .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
            .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
            .MinimumLevel.Override("System", LogEventLevel.Warning)
            .Enrich.FromLogContext()
            .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj}{NewLine}{Exception}")
            .WriteTo.File("logs/portfolio-api-.txt", rollingInterval: RollingInterval.Day)
            .CreateLogger();
    }

    public static IHostBuilder UseSerilogConfiguration(this IHostBuilder host)
    {
        return host.UseSerilog();
    }
}