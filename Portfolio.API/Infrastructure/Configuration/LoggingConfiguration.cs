using Serilog;

namespace Portfolio.API.Configuration;

public static class LoggingConfiguration
{
    public static void ConfigureSerilog()
    {
        Log.Logger = new LoggerConfiguration()
            .WriteTo.Console()
            .WriteTo.File("logs/portfolio-api-.txt", rollingInterval: RollingInterval.Day)
            .CreateLogger();
    }

    public static IHostBuilder UseSerilogConfiguration(this IHostBuilder host)
    {
        return host.UseSerilog();
    }
}