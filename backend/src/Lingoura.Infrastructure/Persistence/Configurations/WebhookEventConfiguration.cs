using Lingoura.Domain.Entities;
using Lingoura.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Lingoura.Infrastructure.Persistence.Configurations;

public sealed class WebhookEventConfiguration : IEntityTypeConfiguration<WebhookEvent>
{
    public void Configure(EntityTypeBuilder<WebhookEvent> b)
    {
        b.ToTable("WebhookEvents");
        b.HasKey(x => x.Id);

        b.Property(x => x.Provider).HasConversion<string>().HasMaxLength(20);
        b.Property(x => x.ProviderEventId).HasMaxLength(200).IsRequired();
        b.Property(x => x.EventType).HasMaxLength(100).IsRequired();
        b.Property(x => x.ProcessingStatus).HasMaxLength(20);
        b.Property(x => x.ErrorMessage).HasMaxLength(1000);

        // UNIQUE(Provider, ProviderEventId) — primary defense against replay attacks
        b.HasIndex(x => new { x.Provider, x.ProviderEventId }).IsUnique();
        b.HasIndex(x => x.ProcessingStatus);
    }
}
