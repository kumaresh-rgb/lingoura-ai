using Lingoura.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Lingoura.Infrastructure.Persistence.Configurations;

public sealed class AuditLogConfiguration : IEntityTypeConfiguration<AuditLog>
{
    public void Configure(EntityTypeBuilder<AuditLog> b)
    {
        b.ToTable("AuditLogs");
        b.HasKey(x => x.Id);
        b.Property(x => x.Id).UseIdentityColumn();   // BIGSERIAL — sequential for ordering

        b.Property(x => x.Action).HasMaxLength(100).IsRequired();
        b.Property(x => x.ResourceType).HasMaxLength(50);
        b.Property(x => x.ResourceId).HasMaxLength(100);
        b.Property(x => x.IpAddress).HasMaxLength(50);
        b.Property(x => x.CorrelationId).HasMaxLength(50);

        b.HasIndex(x => x.UserId);
        b.HasIndex(x => x.Action);
        b.HasIndex(x => x.CreatedAtUtc);
    }
}
