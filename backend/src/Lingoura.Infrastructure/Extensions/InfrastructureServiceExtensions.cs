using System.Text;
using Lingoura.Application.Common.Interfaces;
using Lingoura.Domain.Entities;
using Lingoura.Infrastructure.Authentication;
using Lingoura.Infrastructure.Options;
using Lingoura.Infrastructure.Persistence;
using Lingoura.Infrastructure.Persistence.Interceptors;
using Lingoura.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using StackExchange.Redis;

namespace Lingoura.Infrastructure.Extensions;

public static class InfrastructureServiceExtensions
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services, IConfiguration configuration)
    {
        services.AddOptions<JwtOptions>()
            .Bind(configuration.GetSection(JwtOptions.SectionName))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services.AddOptions<GoogleAuthOptions>()
            .Bind(configuration.GetSection(GoogleAuthOptions.SectionName))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services.AddOptions<DatabaseOptions>()
            .Bind(configuration.GetSection(DatabaseOptions.SectionName))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services.AddSingleton<AuditSaveChangesInterceptor>();

        services.AddDbContext<ApplicationDbContext>((sp, opts) =>
        {
            var dbOpts     = sp.GetRequiredService<IOptions<DatabaseOptions>>().Value;
            var interceptor = sp.GetRequiredService<AuditSaveChangesInterceptor>();

            opts.UseNpgsql(dbOpts.ConnectionString, npgsql =>
                {
                    npgsql.MigrationsAssembly("Lingoura.Infrastructure");
                    npgsql.MigrationsHistoryTable("__EFMigrationsHistory");
                    npgsql.CommandTimeout(30);
                    npgsql.EnableRetryOnFailure(
                        maxRetryCount: 3,
                        maxRetryDelay: TimeSpan.FromSeconds(5),
                        errorCodesToAdd: null);
                })
                .AddInterceptors(interceptor)
                // Query filters with lambda expressions are non-deterministic per EF Core 9's
                // strict model-change detection. This warning is safe to suppress here because
                // our filter (u => !u.IsDeleted) is logically stable — it never changes at runtime.
                .ConfigureWarnings(w => w.Ignore(
                    Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning,
                    Microsoft.EntityFrameworkCore.Diagnostics.CoreEventId.PossibleIncorrectRequiredNavigationWithQueryFilterInteractionWarning));
        });

        services.AddScoped<IApplicationDbContext>(sp =>
            sp.GetRequiredService<ApplicationDbContext>());

        services.AddIdentityCore<ApplicationUser>(opts =>
        {
            opts.Password.RequiredLength         = 12;
            opts.Password.RequireUppercase       = true;
            opts.Password.RequireLowercase       = true;
            opts.Password.RequireDigit           = true;
            opts.Password.RequireNonAlphanumeric = true;
            opts.Password.RequiredUniqueChars    = 6;

            opts.Lockout.DefaultLockoutTimeSpan  = TimeSpan.FromMinutes(15);
            opts.Lockout.MaxFailedAccessAttempts = 5;
            opts.Lockout.AllowedForNewUsers      = true;

            opts.User.RequireUniqueEmail = true;
        })
        .AddRoles<ApplicationRole>()
        .AddEntityFrameworkStores<ApplicationDbContext>()
        .AddDefaultTokenProviders();

        var jwtSection = configuration.GetSection(JwtOptions.SectionName);
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(opts =>
            {
                opts.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer           = true,
                    ValidateAudience         = true,
                    ValidateLifetime         = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer              = jwtSection["Issuer"],
                    ValidAudience            = jwtSection["Audience"],
                    IssuerSigningKey         = new SymmetricSecurityKey(
                                                  Encoding.UTF8.GetBytes(jwtSection["SecretKey"]!)),
                    ClockSkew                = TimeSpan.Zero,
                };
            });

        services.AddScoped<ITokenService, JwtTokenService>();
        services.AddScoped<IGoogleAuthService, GoogleAuthService>();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddSingleton<IDateTimeProvider, DateTimeProvider>();
        services.AddHttpContextAccessor();

        // ── Payment options ───────────────────────────────────────────────────
        services.AddOptions<StripeOptions>()
            .Bind(configuration.GetSection(StripeOptions.SectionName))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services.AddOptions<RazorpayOptions>()
            .Bind(configuration.GetSection(RazorpayOptions.SectionName))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        // ── Redis ─────────────────────────────────────────────────────────────
        var redisConn = configuration.GetConnectionString("Redis")
            ?? configuration["Redis:ConnectionString"]
            ?? "localhost:6379";
        services.AddSingleton<IConnectionMultiplexer>(_ =>
            ConnectionMultiplexer.Connect(redisConn));
        services.AddScoped<IRedisService, RedisService>();

        // ── Payment services ──────────────────────────────────────────────────
        services.AddHttpClient<IRazorpayService, RazorpayService>();
        services.AddScoped<IStripeService, StripeService>();
        services.AddScoped<IEntitlementService, EntitlementService>();

        // ── Webhook processors (transient — stateless per request) ────────────
        services.AddScoped<StripeWebhookProcessor>();
        services.AddScoped<RazorpayWebhookProcessor>();

        return services;
    }
}
