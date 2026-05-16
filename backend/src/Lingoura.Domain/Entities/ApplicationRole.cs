using Microsoft.AspNetCore.Identity;

namespace Lingoura.Domain.Entities;

public sealed class ApplicationRole : IdentityRole<Guid>
{
    public ApplicationRole() { }
    public ApplicationRole(string name) : base(name) { }
}
