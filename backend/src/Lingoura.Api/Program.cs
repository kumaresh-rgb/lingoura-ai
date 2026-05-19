using Asp.Versioning;
using Lingoura.Api.Middleware;
using Lingoura.Application;
using Lingoura.Domain.Entities;
using Lingoura.Infrastructure.Extensions;
using Lingoura.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Serilog.Events;
using System.Threading.RateLimiting;

// Npgsql 6+ requires DateTime values stored/read as UTC to be of Kind=Utc.
// Legacy mode makes DateTime(Kind=Utc) map to PostgreSQL 'timestamp with time zone',
// which is the correct production behaviour for all our UTC audit columns.
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
    .Enrich.FromLogContext()
    .Enrich.WithMachineName()
    .Enrich.WithProcessId()
    .WriteTo.Console(outputTemplate:
        "[{Timestamp:HH:mm:ss} {Level:u3}] {CorrelationId} {Message:lj}{NewLine}{Exception}")
    .WriteTo.File("logs/lingoura-.log",
        rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: 30)
    .CreateBootstrapLogger();

try
{
    Log.Information("Starting Lingoura API");

    var builder = WebApplication.CreateBuilder(args);

    // User Secrets are loaded automatically in Development by WebApplication.CreateBuilder.
    // In Production, all secrets must come from environment variables or a secrets manager.
    // The UserSecretsId is declared in Lingoura.Api.csproj.

    builder.Host.UseSerilog((ctx, services, cfg) => cfg
        .ReadFrom.Configuration(ctx.Configuration)   // reads MinimumLevel overrides from appsettings
        .ReadFrom.Services(services)
        .Enrich.FromLogContext()
        .Enrich.WithMachineName()
        .Enrich.WithProcessId()
        // Sinks are always wired in code — ReadFrom.Configuration only contributes level overrides.
        .WriteTo.Console(outputTemplate:
            "[{Timestamp:HH:mm:ss} {Level:u3}] {CorrelationId} {Message:lj}{NewLine}{Exception}")
        .WriteTo.File("logs/lingoura-.log",
            rollingInterval: RollingInterval.Day,
            retainedFileCountLimit: 30,
            shared: true));

    builder.Services.AddApplication();
    builder.Services.AddInfrastructure(builder.Configuration);

    builder.Services.AddApiVersioning(opts =>
    {
        opts.DefaultApiVersion = new ApiVersion(1, 0);
        opts.AssumeDefaultVersionWhenUnspecified = true;
        opts.ReportApiVersions = true;
    });

    builder.Services.AddControllers()
        .ConfigureApiBehaviorOptions(opts =>
            opts.SuppressModelStateInvalidFilter = true);   // all validation → FluentValidation → 422
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();

    var allowedOrigins = builder.Configuration
        .GetSection("Cors:AllowedOrigins")
        .Get<string[]>() ?? [];

    builder.Services.AddCors(opts => opts.AddPolicy("LingouraPolicy", policy =>
        policy.WithOrigins(allowedOrigins)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials()));

    builder.Services.AddRateLimiter(opts =>
    {
        opts.AddFixedWindowLimiter("auth", limiter =>
        {
            limiter.Window            = TimeSpan.FromMinutes(1);
            limiter.PermitLimit       = builder.Configuration.GetValue("RateLimit:AuthEndpointsPerMinute", 10);
            limiter.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
            limiter.QueueLimit        = 0;
        });

        opts.AddFixedWindowLimiter("global", limiter =>
        {
            limiter.Window            = TimeSpan.FromMinutes(1);
            limiter.PermitLimit       = builder.Configuration.GetValue("RateLimit:GlobalPerMinute", 100);
            limiter.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
            limiter.QueueLimit        = 5;
        });

        opts.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    });

    var app = builder.Build();

    // Fail-fast: validate DB connectivity before accepting any traffic.
    // This surfaces misconfiguration immediately at startup rather than on first request.
    await ValidateDatabaseAsync(app);
    await SeedDatabaseAsync(app);  // non-fatal — server starts even if seeding fails

    // Middleware pipeline — order is critical
    app.UseMiddleware<GlobalExceptionMiddleware>();
    app.UseMiddleware<CorrelationIdMiddleware>();
    app.UseMiddleware<SecurityHeadersMiddleware>();

    app.UseSerilogRequestLogging();

    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseHttpsRedirection();
    app.UseCors("LingouraPolicy");
    app.UseRateLimiter();
    app.UseAuthentication();
    app.UseAuthorization();

    app.MapControllers().RequireRateLimiting("global");

    await app.RunAsync();
}
catch (Exception ex) when (ex is not HostAbortedException)
{
    Log.Fatal(ex, "Application startup failed");
}
finally
{
    await Log.CloseAndFlushAsync();
}

static async Task SeedDatabaseAsync(WebApplication app)
{
    using var scope = app.Services.CreateScope();
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<ApplicationRole>>();
    var db          = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var logger      = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    try
    {
        await DatabaseSeeder.SeedRolesAsync(roleManager, logger);
        await DatabaseSeeder.SeedVocabularyAsync(db, logger);
    }
    catch (Exception ex)
    {
        // Seeding is best-effort — log and continue so the API starts even if the DB
        // is temporarily unreachable. Data will be seeded on next successful startup.
        logger.LogWarning(ex, "Database seeding skipped due to error — API will start without seed data");
    }
}

static async Task ValidateDatabaseAsync(WebApplication app)
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    try
    {
        // CanConnectAsync: single cheap query, no schema assumptions.
        var canConnect = await db.Database.CanConnectAsync();
        if (!canConnect)
            throw new InvalidOperationException("PostgreSQL reported CanConnect=false.");

        Log.Information("Database connectivity verified");
    }
    catch (Exception ex)
    {
        Log.Fatal(ex,
            "Cannot connect to PostgreSQL. " +
            "Verify Database:ConnectionString in user secrets / environment variables.");
        throw;
    }
}
