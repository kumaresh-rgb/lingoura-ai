using Lingoura.Domain.Entities;
using Lingoura.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace Lingoura.Infrastructure.Persistence;

public static class DatabaseSeeder
{
    public static async Task SeedRolesAsync(
        RoleManager<ApplicationRole> roleManager,
        ILogger logger)
    {
        var roles = Enum.GetNames<UserRole>();

        foreach (var role in roles)
        {
            if (await roleManager.RoleExistsAsync(role))
                continue;

            var result = await roleManager.CreateAsync(new ApplicationRole { Name = role });

            if (result.Succeeded)
                logger.LogInformation("Seeded role: {Role}", role);
            else
                logger.LogError("Failed to seed role {Role}: {Errors}", role,
                    string.Join(", ", result.Errors.Select(e => e.Description)));
        }
    }
}
