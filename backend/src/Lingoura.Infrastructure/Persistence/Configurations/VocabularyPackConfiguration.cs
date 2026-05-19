using Lingoura.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Lingoura.Infrastructure.Persistence.Configurations;

public sealed class VocabularyPackConfiguration : IEntityTypeConfiguration<VocabularyPack>
{
    public void Configure(EntityTypeBuilder<VocabularyPack> b)
    {
        b.ToTable("VocabularyPacks");
        b.HasKey(x => x.Id);

        b.Property(x => x.Slug).IsRequired().HasMaxLength(100);
        b.Property(x => x.Title).IsRequired().HasMaxLength(200);
        b.Property(x => x.Description).HasMaxLength(1000);
        b.Property(x => x.Category).HasMaxLength(50);
        b.Property(x => x.IeltsTopicLabel).HasMaxLength(100);
        b.Property(x => x.CoverEmoji).HasMaxLength(10);
        b.Property(x => x.Color).HasMaxLength(30);

        b.HasIndex(x => x.Slug).IsUnique();
        b.HasIndex(x => x.IsFeatured);
    }
}

public sealed class PackWordConfiguration : IEntityTypeConfiguration<PackWord>
{
    public void Configure(EntityTypeBuilder<PackWord> b)
    {
        b.ToTable("PackWords");
        b.HasKey(x => new { x.PackId, x.WordId });

        b.HasOne(x => x.Pack)
            .WithMany(p => p.PackWords)
            .HasForeignKey(x => x.PackId)
            .OnDelete(DeleteBehavior.Cascade);

        b.HasOne(x => x.Word)
            .WithMany(w => w.PackWords)
            .HasForeignKey(x => x.WordId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
