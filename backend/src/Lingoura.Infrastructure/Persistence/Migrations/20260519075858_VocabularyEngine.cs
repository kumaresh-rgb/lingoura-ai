using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lingoura.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class VocabularyEngine : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "VocabularyPacks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Slug = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    Category = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    IeltsTopicLabel = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    BandTarget = table.Column<int>(type: "integer", nullable: false),
                    WordCount = table.Column<int>(type: "integer", nullable: false),
                    IsFeatured = table.Column<bool>(type: "boolean", nullable: false),
                    CoverEmoji = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    Color = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: true),
                    SortOrder = table.Column<int>(type: "integer", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VocabularyPacks", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "VocabularyWords",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Word = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Slug = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    PartOfSpeech = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    Pronunciation = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    PhoneticIpa = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    AudioUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Definition = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    ShortDefinition = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    Synonyms = table.Column<string[]>(type: "text[]", nullable: false),
                    Antonyms = table.Column<string[]>(type: "text[]", nullable: false),
                    Collocations = table.Column<string[]>(type: "text[]", nullable: false),
                    Examples = table.Column<string[]>(type: "text[]", nullable: false),
                    Mnemonic = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Etymology = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    CommonMistake = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    CefrLevel = table.Column<string>(type: "character varying(3)", maxLength: 3, nullable: false, defaultValue: "B2"),
                    IeltsBandMin = table.Column<int>(type: "integer", nullable: false),
                    Category = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValue: "general"),
                    IsIeltsCore = table.Column<bool>(type: "boolean", nullable: false),
                    IsAcademicWordList = table.Column<bool>(type: "boolean", nullable: false),
                    Source = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false, defaultValue: "internal"),
                    MwWordId = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EnrichedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VocabularyWords", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DailyWords",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Date = table.Column<DateOnly>(type: "date", nullable: false),
                    WordId = table.Column<Guid>(type: "uuid", nullable: false),
                    Source = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false, defaultValue: "internal"),
                    MwRawJson = table.Column<string>(type: "jsonb", nullable: true),
                    FetchedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DailyWords", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DailyWords_VocabularyWords_WordId",
                        column: x => x.WordId,
                        principalTable: "VocabularyWords",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PackWords",
                columns: table => new
                {
                    PackId = table.Column<Guid>(type: "uuid", nullable: false),
                    WordId = table.Column<Guid>(type: "uuid", nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PackWords", x => new { x.PackId, x.WordId });
                    table.ForeignKey(
                        name: "FK_PackWords_VocabularyPacks_PackId",
                        column: x => x.PackId,
                        principalTable: "VocabularyPacks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PackWords_VocabularyWords_WordId",
                        column: x => x.WordId,
                        principalTable: "VocabularyWords",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserWordProgress",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    WordId = table.Column<Guid>(type: "uuid", nullable: false),
                    Status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "new"),
                    EaseFactor = table.Column<float>(type: "real", nullable: false, defaultValue: 2.5f),
                    IntervalDays = table.Column<int>(type: "integer", nullable: false, defaultValue: 1),
                    Repetitions = table.Column<int>(type: "integer", nullable: false),
                    NextReviewAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastReviewedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CorrectStreak = table.Column<int>(type: "integer", nullable: false),
                    TotalReviews = table.Column<int>(type: "integer", nullable: false),
                    CorrectReviews = table.Column<int>(type: "integer", nullable: false),
                    LearnedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserWordProgress", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserWordProgress_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserWordProgress_VocabularyWords_WordId",
                        column: x => x.WordId,
                        principalTable: "VocabularyWords",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "FeatureEntitlements",
                keyColumn: "Id",
                keyValue: new Guid("10000001-0000-0000-0000-000000000001"),
                column: "CreatedAtUtc",
                value: new DateTime(2026, 5, 19, 7, 58, 55, 726, DateTimeKind.Utc).AddTicks(1189));

            migrationBuilder.UpdateData(
                table: "FeatureEntitlements",
                keyColumn: "Id",
                keyValue: new Guid("10000001-0000-0000-0000-000000000002"),
                column: "CreatedAtUtc",
                value: new DateTime(2026, 5, 19, 7, 58, 55, 726, DateTimeKind.Utc).AddTicks(2392));

            migrationBuilder.UpdateData(
                table: "FeatureEntitlements",
                keyColumn: "Id",
                keyValue: new Guid("10000001-0000-0000-0000-000000000003"),
                column: "CreatedAtUtc",
                value: new DateTime(2026, 5, 19, 7, 58, 55, 726, DateTimeKind.Utc).AddTicks(2396));

            migrationBuilder.UpdateData(
                table: "FeatureEntitlements",
                keyColumn: "Id",
                keyValue: new Guid("10000001-0000-0000-0000-000000000004"),
                column: "CreatedAtUtc",
                value: new DateTime(2026, 5, 19, 7, 58, 55, 726, DateTimeKind.Utc).AddTicks(2399));

            migrationBuilder.UpdateData(
                table: "FeatureEntitlements",
                keyColumn: "Id",
                keyValue: new Guid("10000001-0000-0000-0000-000000000005"),
                column: "CreatedAtUtc",
                value: new DateTime(2026, 5, 19, 7, 58, 55, 726, DateTimeKind.Utc).AddTicks(2400));

            migrationBuilder.UpdateData(
                table: "FeatureEntitlements",
                keyColumn: "Id",
                keyValue: new Guid("10000002-0000-0000-0000-000000000001"),
                column: "CreatedAtUtc",
                value: new DateTime(2026, 5, 19, 7, 58, 55, 726, DateTimeKind.Utc).AddTicks(2410));

            migrationBuilder.UpdateData(
                table: "FeatureEntitlements",
                keyColumn: "Id",
                keyValue: new Guid("10000002-0000-0000-0000-000000000002"),
                column: "CreatedAtUtc",
                value: new DateTime(2026, 5, 19, 7, 58, 55, 726, DateTimeKind.Utc).AddTicks(2412));

            migrationBuilder.UpdateData(
                table: "FeatureEntitlements",
                keyColumn: "Id",
                keyValue: new Guid("10000002-0000-0000-0000-000000000003"),
                column: "CreatedAtUtc",
                value: new DateTime(2026, 5, 19, 7, 58, 55, 726, DateTimeKind.Utc).AddTicks(2414));

            migrationBuilder.UpdateData(
                table: "FeatureEntitlements",
                keyColumn: "Id",
                keyValue: new Guid("10000002-0000-0000-0000-000000000004"),
                column: "CreatedAtUtc",
                value: new DateTime(2026, 5, 19, 7, 58, 55, 726, DateTimeKind.Utc).AddTicks(2416));

            migrationBuilder.UpdateData(
                table: "FeatureEntitlements",
                keyColumn: "Id",
                keyValue: new Guid("10000002-0000-0000-0000-000000000005"),
                column: "CreatedAtUtc",
                value: new DateTime(2026, 5, 19, 7, 58, 55, 726, DateTimeKind.Utc).AddTicks(2418));

            migrationBuilder.UpdateData(
                table: "FeatureEntitlements",
                keyColumn: "Id",
                keyValue: new Guid("10000003-0000-0000-0000-000000000001"),
                column: "CreatedAtUtc",
                value: new DateTime(2026, 5, 19, 7, 58, 55, 726, DateTimeKind.Utc).AddTicks(2419));

            migrationBuilder.UpdateData(
                table: "FeatureEntitlements",
                keyColumn: "Id",
                keyValue: new Guid("10000003-0000-0000-0000-000000000002"),
                column: "CreatedAtUtc",
                value: new DateTime(2026, 5, 19, 7, 58, 55, 726, DateTimeKind.Utc).AddTicks(2421));

            migrationBuilder.UpdateData(
                table: "FeatureEntitlements",
                keyColumn: "Id",
                keyValue: new Guid("10000003-0000-0000-0000-000000000003"),
                column: "CreatedAtUtc",
                value: new DateTime(2026, 5, 19, 7, 58, 55, 726, DateTimeKind.Utc).AddTicks(2423));

            migrationBuilder.UpdateData(
                table: "FeatureEntitlements",
                keyColumn: "Id",
                keyValue: new Guid("10000003-0000-0000-0000-000000000004"),
                column: "CreatedAtUtc",
                value: new DateTime(2026, 5, 19, 7, 58, 55, 726, DateTimeKind.Utc).AddTicks(2427));

            migrationBuilder.UpdateData(
                table: "FeatureEntitlements",
                keyColumn: "Id",
                keyValue: new Guid("10000003-0000-0000-0000-000000000005"),
                column: "CreatedAtUtc",
                value: new DateTime(2026, 5, 19, 7, 58, 55, 726, DateTimeKind.Utc).AddTicks(2429));

            migrationBuilder.UpdateData(
                table: "FeatureEntitlements",
                keyColumn: "Id",
                keyValue: new Guid("10000004-0000-0000-0000-000000000001"),
                column: "CreatedAtUtc",
                value: new DateTime(2026, 5, 19, 7, 58, 55, 726, DateTimeKind.Utc).AddTicks(2431));

            migrationBuilder.UpdateData(
                table: "FeatureEntitlements",
                keyColumn: "Id",
                keyValue: new Guid("10000004-0000-0000-0000-000000000002"),
                column: "CreatedAtUtc",
                value: new DateTime(2026, 5, 19, 7, 58, 55, 726, DateTimeKind.Utc).AddTicks(2434));

            migrationBuilder.UpdateData(
                table: "FeatureEntitlements",
                keyColumn: "Id",
                keyValue: new Guid("10000004-0000-0000-0000-000000000003"),
                column: "CreatedAtUtc",
                value: new DateTime(2026, 5, 19, 7, 58, 55, 726, DateTimeKind.Utc).AddTicks(2436));

            migrationBuilder.UpdateData(
                table: "FeatureEntitlements",
                keyColumn: "Id",
                keyValue: new Guid("10000004-0000-0000-0000-000000000004"),
                column: "CreatedAtUtc",
                value: new DateTime(2026, 5, 19, 7, 58, 55, 726, DateTimeKind.Utc).AddTicks(2438));

            migrationBuilder.UpdateData(
                table: "FeatureEntitlements",
                keyColumn: "Id",
                keyValue: new Guid("10000004-0000-0000-0000-000000000005"),
                column: "CreatedAtUtc",
                value: new DateTime(2026, 5, 19, 7, 58, 55, 726, DateTimeKind.Utc).AddTicks(2440));

            migrationBuilder.UpdateData(
                table: "SubscriptionPlans",
                keyColumn: "Id",
                keyValue: "ELITE",
                columns: new[] { "CreatedAtUtc", "UpdatedAtUtc" },
                values: new object[] { new DateTime(2026, 5, 19, 7, 58, 55, 740, DateTimeKind.Utc).AddTicks(3229), new DateTime(2026, 5, 19, 7, 58, 55, 740, DateTimeKind.Utc).AddTicks(3229) });

            migrationBuilder.UpdateData(
                table: "SubscriptionPlans",
                keyColumn: "Id",
                keyValue: "ENTERPRISE",
                columns: new[] { "CreatedAtUtc", "UpdatedAtUtc" },
                values: new object[] { new DateTime(2026, 5, 19, 7, 58, 55, 740, DateTimeKind.Utc).AddTicks(3231), new DateTime(2026, 5, 19, 7, 58, 55, 740, DateTimeKind.Utc).AddTicks(3231) });

            migrationBuilder.UpdateData(
                table: "SubscriptionPlans",
                keyColumn: "Id",
                keyValue: "FREE",
                columns: new[] { "CreatedAtUtc", "UpdatedAtUtc" },
                values: new object[] { new DateTime(2026, 5, 19, 7, 58, 55, 740, DateTimeKind.Utc).AddTicks(1371), new DateTime(2026, 5, 19, 7, 58, 55, 740, DateTimeKind.Utc).AddTicks(1374) });

            migrationBuilder.UpdateData(
                table: "SubscriptionPlans",
                keyColumn: "Id",
                keyValue: "PRO",
                columns: new[] { "CreatedAtUtc", "UpdatedAtUtc" },
                values: new object[] { new DateTime(2026, 5, 19, 7, 58, 55, 740, DateTimeKind.Utc).AddTicks(3206), new DateTime(2026, 5, 19, 7, 58, 55, 740, DateTimeKind.Utc).AddTicks(3207) });

            migrationBuilder.CreateIndex(
                name: "IX_DailyWords_Date",
                table: "DailyWords",
                column: "Date",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DailyWords_WordId",
                table: "DailyWords",
                column: "WordId");

            migrationBuilder.CreateIndex(
                name: "IX_PackWords_WordId",
                table: "PackWords",
                column: "WordId");

            migrationBuilder.CreateIndex(
                name: "IX_UserWordProgress_UserId_NextReviewAt",
                table: "UserWordProgress",
                columns: new[] { "UserId", "NextReviewAt" });

            migrationBuilder.CreateIndex(
                name: "IX_UserWordProgress_UserId_Status",
                table: "UserWordProgress",
                columns: new[] { "UserId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_UserWordProgress_UserId_WordId",
                table: "UserWordProgress",
                columns: new[] { "UserId", "WordId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserWordProgress_WordId",
                table: "UserWordProgress",
                column: "WordId");

            migrationBuilder.CreateIndex(
                name: "IX_VocabularyPacks_IsFeatured",
                table: "VocabularyPacks",
                column: "IsFeatured");

            migrationBuilder.CreateIndex(
                name: "IX_VocabularyPacks_Slug",
                table: "VocabularyPacks",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_VocabularyWords_Category",
                table: "VocabularyWords",
                column: "Category");

            migrationBuilder.CreateIndex(
                name: "IX_VocabularyWords_IeltsBandMin_IsIeltsCore",
                table: "VocabularyWords",
                columns: new[] { "IeltsBandMin", "IsIeltsCore" });

            migrationBuilder.CreateIndex(
                name: "IX_VocabularyWords_Slug",
                table: "VocabularyWords",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_VocabularyWords_Word",
                table: "VocabularyWords",
                column: "Word",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DailyWords");

            migrationBuilder.DropTable(
                name: "PackWords");

            migrationBuilder.DropTable(
                name: "UserWordProgress");

            migrationBuilder.DropTable(
                name: "VocabularyPacks");

            migrationBuilder.DropTable(
                name: "VocabularyWords");

            migrationBuilder.UpdateData(
                table: "FeatureEntitlements",
                keyColumn: "Id",
                keyValue: new Guid("10000001-0000-0000-0000-000000000001"),
                column: "CreatedAtUtc",
                value: new DateTime(2026, 5, 18, 16, 22, 48, 84, DateTimeKind.Utc).AddTicks(1750));

            migrationBuilder.UpdateData(
                table: "FeatureEntitlements",
                keyColumn: "Id",
                keyValue: new Guid("10000001-0000-0000-0000-000000000002"),
                column: "CreatedAtUtc",
                value: new DateTime(2026, 5, 18, 16, 22, 48, 84, DateTimeKind.Utc).AddTicks(5511));

            migrationBuilder.UpdateData(
                table: "FeatureEntitlements",
                keyColumn: "Id",
                keyValue: new Guid("10000001-0000-0000-0000-000000000003"),
                column: "CreatedAtUtc",
                value: new DateTime(2026, 5, 18, 16, 22, 48, 84, DateTimeKind.Utc).AddTicks(5526));

            migrationBuilder.UpdateData(
                table: "FeatureEntitlements",
                keyColumn: "Id",
                keyValue: new Guid("10000001-0000-0000-0000-000000000004"),
                column: "CreatedAtUtc",
                value: new DateTime(2026, 5, 18, 16, 22, 48, 84, DateTimeKind.Utc).AddTicks(5533));

            migrationBuilder.UpdateData(
                table: "FeatureEntitlements",
                keyColumn: "Id",
                keyValue: new Guid("10000001-0000-0000-0000-000000000005"),
                column: "CreatedAtUtc",
                value: new DateTime(2026, 5, 18, 16, 22, 48, 84, DateTimeKind.Utc).AddTicks(5540));

            migrationBuilder.UpdateData(
                table: "FeatureEntitlements",
                keyColumn: "Id",
                keyValue: new Guid("10000002-0000-0000-0000-000000000001"),
                column: "CreatedAtUtc",
                value: new DateTime(2026, 5, 18, 16, 22, 48, 84, DateTimeKind.Utc).AddTicks(5546));

            migrationBuilder.UpdateData(
                table: "FeatureEntitlements",
                keyColumn: "Id",
                keyValue: new Guid("10000002-0000-0000-0000-000000000002"),
                column: "CreatedAtUtc",
                value: new DateTime(2026, 5, 18, 16, 22, 48, 84, DateTimeKind.Utc).AddTicks(5552));

            migrationBuilder.UpdateData(
                table: "FeatureEntitlements",
                keyColumn: "Id",
                keyValue: new Guid("10000002-0000-0000-0000-000000000003"),
                column: "CreatedAtUtc",
                value: new DateTime(2026, 5, 18, 16, 22, 48, 84, DateTimeKind.Utc).AddTicks(5557));

            migrationBuilder.UpdateData(
                table: "FeatureEntitlements",
                keyColumn: "Id",
                keyValue: new Guid("10000002-0000-0000-0000-000000000004"),
                column: "CreatedAtUtc",
                value: new DateTime(2026, 5, 18, 16, 22, 48, 84, DateTimeKind.Utc).AddTicks(5573));

            migrationBuilder.UpdateData(
                table: "FeatureEntitlements",
                keyColumn: "Id",
                keyValue: new Guid("10000002-0000-0000-0000-000000000005"),
                column: "CreatedAtUtc",
                value: new DateTime(2026, 5, 18, 16, 22, 48, 84, DateTimeKind.Utc).AddTicks(5580));

            migrationBuilder.UpdateData(
                table: "FeatureEntitlements",
                keyColumn: "Id",
                keyValue: new Guid("10000003-0000-0000-0000-000000000001"),
                column: "CreatedAtUtc",
                value: new DateTime(2026, 5, 18, 16, 22, 48, 84, DateTimeKind.Utc).AddTicks(5585));

            migrationBuilder.UpdateData(
                table: "FeatureEntitlements",
                keyColumn: "Id",
                keyValue: new Guid("10000003-0000-0000-0000-000000000002"),
                column: "CreatedAtUtc",
                value: new DateTime(2026, 5, 18, 16, 22, 48, 84, DateTimeKind.Utc).AddTicks(5591));

            migrationBuilder.UpdateData(
                table: "FeatureEntitlements",
                keyColumn: "Id",
                keyValue: new Guid("10000003-0000-0000-0000-000000000003"),
                column: "CreatedAtUtc",
                value: new DateTime(2026, 5, 18, 16, 22, 48, 84, DateTimeKind.Utc).AddTicks(5597));

            migrationBuilder.UpdateData(
                table: "FeatureEntitlements",
                keyColumn: "Id",
                keyValue: new Guid("10000003-0000-0000-0000-000000000004"),
                column: "CreatedAtUtc",
                value: new DateTime(2026, 5, 18, 16, 22, 48, 84, DateTimeKind.Utc).AddTicks(5603));

            migrationBuilder.UpdateData(
                table: "FeatureEntitlements",
                keyColumn: "Id",
                keyValue: new Guid("10000003-0000-0000-0000-000000000005"),
                column: "CreatedAtUtc",
                value: new DateTime(2026, 5, 18, 16, 22, 48, 84, DateTimeKind.Utc).AddTicks(5608));

            migrationBuilder.UpdateData(
                table: "FeatureEntitlements",
                keyColumn: "Id",
                keyValue: new Guid("10000004-0000-0000-0000-000000000001"),
                column: "CreatedAtUtc",
                value: new DateTime(2026, 5, 18, 16, 22, 48, 84, DateTimeKind.Utc).AddTicks(5613));

            migrationBuilder.UpdateData(
                table: "FeatureEntitlements",
                keyColumn: "Id",
                keyValue: new Guid("10000004-0000-0000-0000-000000000002"),
                column: "CreatedAtUtc",
                value: new DateTime(2026, 5, 18, 16, 22, 48, 84, DateTimeKind.Utc).AddTicks(5625));

            migrationBuilder.UpdateData(
                table: "FeatureEntitlements",
                keyColumn: "Id",
                keyValue: new Guid("10000004-0000-0000-0000-000000000003"),
                column: "CreatedAtUtc",
                value: new DateTime(2026, 5, 18, 16, 22, 48, 84, DateTimeKind.Utc).AddTicks(5631));

            migrationBuilder.UpdateData(
                table: "FeatureEntitlements",
                keyColumn: "Id",
                keyValue: new Guid("10000004-0000-0000-0000-000000000004"),
                column: "CreatedAtUtc",
                value: new DateTime(2026, 5, 18, 16, 22, 48, 84, DateTimeKind.Utc).AddTicks(5636));

            migrationBuilder.UpdateData(
                table: "FeatureEntitlements",
                keyColumn: "Id",
                keyValue: new Guid("10000004-0000-0000-0000-000000000005"),
                column: "CreatedAtUtc",
                value: new DateTime(2026, 5, 18, 16, 22, 48, 84, DateTimeKind.Utc).AddTicks(5642));

            migrationBuilder.UpdateData(
                table: "SubscriptionPlans",
                keyColumn: "Id",
                keyValue: "ELITE",
                columns: new[] { "CreatedAtUtc", "UpdatedAtUtc" },
                values: new object[] { new DateTime(2026, 5, 18, 16, 22, 48, 121, DateTimeKind.Utc).AddTicks(957), new DateTime(2026, 5, 18, 16, 22, 48, 121, DateTimeKind.Utc).AddTicks(958) });

            migrationBuilder.UpdateData(
                table: "SubscriptionPlans",
                keyColumn: "Id",
                keyValue: "ENTERPRISE",
                columns: new[] { "CreatedAtUtc", "UpdatedAtUtc" },
                values: new object[] { new DateTime(2026, 5, 18, 16, 22, 48, 121, DateTimeKind.Utc).AddTicks(962), new DateTime(2026, 5, 18, 16, 22, 48, 121, DateTimeKind.Utc).AddTicks(962) });

            migrationBuilder.UpdateData(
                table: "SubscriptionPlans",
                keyColumn: "Id",
                keyValue: "FREE",
                columns: new[] { "CreatedAtUtc", "UpdatedAtUtc" },
                values: new object[] { new DateTime(2026, 5, 18, 16, 22, 48, 120, DateTimeKind.Utc).AddTicks(7185), new DateTime(2026, 5, 18, 16, 22, 48, 120, DateTimeKind.Utc).AddTicks(7189) });

            migrationBuilder.UpdateData(
                table: "SubscriptionPlans",
                keyColumn: "Id",
                keyValue: "PRO",
                columns: new[] { "CreatedAtUtc", "UpdatedAtUtc" },
                values: new object[] { new DateTime(2026, 5, 18, 16, 22, 48, 121, DateTimeKind.Utc).AddTicks(912), new DateTime(2026, 5, 18, 16, 22, 48, 121, DateTimeKind.Utc).AddTicks(913) });
        }
    }
}
