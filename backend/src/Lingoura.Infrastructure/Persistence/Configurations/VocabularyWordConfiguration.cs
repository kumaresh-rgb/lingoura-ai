using Lingoura.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Lingoura.Infrastructure.Persistence.Configurations;

public sealed class VocabularyWordConfiguration : IEntityTypeConfiguration<VocabularyWord>
{
    public void Configure(EntityTypeBuilder<VocabularyWord> b)
    {
        b.ToTable("VocabularyWords");
        b.HasKey(x => x.Id);

        b.Property(x => x.Word).IsRequired().HasMaxLength(100);
        b.Property(x => x.Slug).IsRequired().HasMaxLength(100);
        b.Property(x => x.PartOfSpeech).IsRequired().HasMaxLength(30);
        b.Property(x => x.Pronunciation).HasMaxLength(100);
        b.Property(x => x.PhoneticIpa).HasMaxLength(100);
        b.Property(x => x.AudioUrl).HasMaxLength(500);
        b.Property(x => x.Definition).HasMaxLength(1000);
        b.Property(x => x.ShortDefinition).HasMaxLength(300);
        b.Property(x => x.CefrLevel).IsRequired().HasMaxLength(3).HasDefaultValue("B2");
        b.Property(x => x.Category).IsRequired().HasMaxLength(50).HasDefaultValue("general");
        b.Property(x => x.Source).IsRequired().HasMaxLength(30).HasDefaultValue("internal");
        b.Property(x => x.MwWordId).HasMaxLength(200);
        b.Property(x => x.Mnemonic).HasMaxLength(500);
        b.Property(x => x.Etymology).HasMaxLength(500);
        b.Property(x => x.CommonMistake).HasMaxLength(500);

        // PostgreSQL text arrays for enriched content
        b.Property(x => x.Synonyms).HasColumnType("text[]");
        b.Property(x => x.Antonyms).HasColumnType("text[]");
        b.Property(x => x.Collocations).HasColumnType("text[]");
        b.Property(x => x.Examples).HasColumnType("text[]");

        b.HasIndex(x => x.Slug).IsUnique();
        b.HasIndex(x => x.Word).IsUnique();
        b.HasIndex(x => new { x.IeltsBandMin, x.IsIeltsCore });
        b.HasIndex(x => x.Category);
    }
}
