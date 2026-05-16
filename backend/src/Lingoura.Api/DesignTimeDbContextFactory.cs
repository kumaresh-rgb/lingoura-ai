using Lingoura.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Lingoura.Api;

// Used exclusively by EF Core design-time tools (dotnet ef migrations add/update).
// The regular runtime context is wired through InfrastructureServiceExtensions.
// This factory builds its own minimal config so migrations can run without needing
// the full host (including GoogleAuth, Redis, etc.) to be valid.
public sealed class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development";

        // EF tools set CWD to the startup-project directory when --startup-project is used.
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: false)
            .AddJsonFile($"appsettings.{environment}.json", optional: true,  reloadOnChange: false)
            .AddUserSecrets<DesignTimeDbContextFactory>(optional: true)
            .AddEnvironmentVariables()
            .Build();

        var connectionString = configuration["Database:ConnectionString"];

        if (string.IsNullOrWhiteSpace(connectionString))
            throw new InvalidOperationException(
                "Database:ConnectionString is not configured for design-time migrations.\n" +
                "Set it via user secrets:\n" +
                "  dotnet user-secrets set \"Database:ConnectionString\" " +
                "\"Host=localhost;Port=5432;Database=lingoura;Username=postgres;Password=YOUR_PASSWORD\" " +
                "--project src/Lingoura.Api");

        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
        optionsBuilder.UseNpgsql(connectionString, npgsql =>
            npgsql.MigrationsAssembly("Lingoura.Infrastructure"));

        return new ApplicationDbContext(optionsBuilder.Options);
    }
}
