using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Lingoura.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class BillingAndSubscriptions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AuditLogs",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<Guid>(type: "uuid", nullable: true),
                    ActorId = table.Column<Guid>(type: "uuid", nullable: true),
                    Action = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ResourceType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    ResourceId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    OldValueJson = table.Column<string>(type: "text", nullable: true),
                    NewValueJson = table.Column<string>(type: "text", nullable: true),
                    IpAddress = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    UserAgent = table.Column<string>(type: "text", nullable: true),
                    CorrelationId = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditLogs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Invoices",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    SubscriptionId = table.Column<Guid>(type: "uuid", nullable: true),
                    PaymentId = table.Column<Guid>(type: "uuid", nullable: true),
                    InvoiceNumber = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    Amount = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: false),
                    Currency = table.Column<string>(type: "character varying(3)", maxLength: 3, nullable: false),
                    TaxAmount = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: false),
                    Status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    DueDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    PaidAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    PdfUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Invoices", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Invoices_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PaymentAttempts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    PlanId = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Provider = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    SessionId = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    IpAddress = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    UserAgent = table.Column<string>(type: "text", nullable: true),
                    Outcome = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    FailureReason = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PaymentAttempts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SubscriptionPlans",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    DisplayName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    MonthlyPriceUsd = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    MonthlyPriceInr = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    AnnualPriceUsd = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    AnnualPriceInr = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    StripePriceIdMonthly = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    StripePriceIdAnnual = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    RazorpayPlanIdMonthly = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    RazorpayPlanIdAnnual = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubscriptionPlans", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UsageRecords",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Feature = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    PeriodStart = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    PeriodEnd = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UsedCount = table.Column<int>(type: "integer", nullable: false),
                    LimitSnapshot = table.Column<int>(type: "integer", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UsageRecords", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UsageRecords_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserProfiles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    CefrLevel = table.Column<string>(type: "character varying(2)", maxLength: 2, nullable: false),
                    TargetBand = table.Column<decimal>(type: "numeric(3,1)", precision: 3, scale: 1, nullable: false),
                    CountryCode = table.Column<string>(type: "character varying(2)", maxLength: 2, nullable: true),
                    Timezone = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    PreferredPaymentProvider = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    OnboardingCompleted = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserProfiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserProfiles_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WebhookEvents",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Provider = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    ProviderEventId = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    EventType = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    PayloadJson = table.Column<string>(type: "text", nullable: false),
                    ProcessingStatus = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    ErrorMessage = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    RetryCount = table.Column<int>(type: "integer", nullable: false),
                    ProcessedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WebhookEvents", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FeatureEntitlements",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PlanId = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Feature = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    LimitValue = table.Column<int>(type: "integer", nullable: false),
                    ResetPeriod = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FeatureEntitlements", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FeatureEntitlements_SubscriptionPlans_PlanId",
                        column: x => x.PlanId,
                        principalTable: "SubscriptionPlans",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Subscriptions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    PlanId = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Interval = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    Provider = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    StripeCustomerId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    StripeSubscriptionId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    StripePriceId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    RazorpayCustomerId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    RazorpaySubscriptionId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    RazorpayPlanId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    CurrentPeriodStart = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CurrentPeriodEnd = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CancelAtPeriodEnd = table.Column<bool>(type: "boolean", nullable: false),
                    CanceledAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    GracePeriodEndUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Subscriptions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Subscriptions_SubscriptionPlans_PlanId",
                        column: x => x.PlanId,
                        principalTable: "SubscriptionPlans",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Subscriptions_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Payments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    SubscriptionId = table.Column<Guid>(type: "uuid", nullable: true),
                    Provider = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    ProviderPaymentId = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    ProviderOrderId = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Amount = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: false),
                    Currency = table.Column<string>(type: "character varying(3)", maxLength: 3, nullable: false),
                    Status = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    IdempotencyKey = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    InvoiceId = table.Column<Guid>(type: "uuid", nullable: true),
                    FailureReason = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Payments_Subscriptions_SubscriptionId",
                        column: x => x.SubscriptionId,
                        principalTable: "Subscriptions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Payments_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "SubscriptionPlans",
                columns: new[] { "Id", "AnnualPriceInr", "AnnualPriceUsd", "CreatedAtUtc", "DisplayName", "IsActive", "MonthlyPriceInr", "MonthlyPriceUsd", "RazorpayPlanIdAnnual", "RazorpayPlanIdMonthly", "SortOrder", "StripePriceIdAnnual", "StripePriceIdMonthly", "UpdatedAtUtc" },
                values: new object[,]
                {
                    { "ELITE", 2499m, 29m, new DateTime(2026, 5, 18, 16, 22, 48, 121, DateTimeKind.Utc).AddTicks(957), "Elite", true, 3299m, 39m, null, null, 2, null, null, new DateTime(2026, 5, 18, 16, 22, 48, 121, DateTimeKind.Utc).AddTicks(958) },
                    { "ENTERPRISE", 0m, 0m, new DateTime(2026, 5, 18, 16, 22, 48, 121, DateTimeKind.Utc).AddTicks(962), "Enterprise", true, 0m, 0m, null, null, 3, null, null, new DateTime(2026, 5, 18, 16, 22, 48, 121, DateTimeKind.Utc).AddTicks(962) },
                    { "FREE", 0m, 0m, new DateTime(2026, 5, 18, 16, 22, 48, 120, DateTimeKind.Utc).AddTicks(7185), "Free", true, 0m, 0m, null, null, 0, null, null, new DateTime(2026, 5, 18, 16, 22, 48, 120, DateTimeKind.Utc).AddTicks(7189) },
                    { "PRO", 1199m, 15m, new DateTime(2026, 5, 18, 16, 22, 48, 121, DateTimeKind.Utc).AddTicks(912), "Pro", true, 1599m, 19m, null, null, 1, null, null, new DateTime(2026, 5, 18, 16, 22, 48, 121, DateTimeKind.Utc).AddTicks(913) }
                });

            migrationBuilder.InsertData(
                table: "FeatureEntitlements",
                columns: new[] { "Id", "CreatedAtUtc", "Feature", "LimitValue", "PlanId", "ResetPeriod" },
                values: new object[,]
                {
                    { new Guid("10000001-0000-0000-0000-000000000001"), new DateTime(2026, 5, 18, 16, 22, 48, 84, DateTimeKind.Utc).AddTicks(1750), "ai_chats", 5, "FREE", "daily" },
                    { new Guid("10000001-0000-0000-0000-000000000002"), new DateTime(2026, 5, 18, 16, 22, 48, 84, DateTimeKind.Utc).AddTicks(5511), "speaking_sessions", 2, "FREE", "monthly" },
                    { new Guid("10000001-0000-0000-0000-000000000003"), new DateTime(2026, 5, 18, 16, 22, 48, 84, DateTimeKind.Utc).AddTicks(5526), "writing_submissions", 2, "FREE", "monthly" },
                    { new Guid("10000001-0000-0000-0000-000000000004"), new DateTime(2026, 5, 18, 16, 22, 48, 84, DateTimeKind.Utc).AddTicks(5533), "mock_tests", 1, "FREE", "monthly" },
                    { new Guid("10000001-0000-0000-0000-000000000005"), new DateTime(2026, 5, 18, 16, 22, 48, 84, DateTimeKind.Utc).AddTicks(5540), "vocabulary_words", 10, "FREE", "daily" },
                    { new Guid("10000002-0000-0000-0000-000000000001"), new DateTime(2026, 5, 18, 16, 22, 48, 84, DateTimeKind.Utc).AddTicks(5546), "ai_chats", 100, "PRO", "daily" },
                    { new Guid("10000002-0000-0000-0000-000000000002"), new DateTime(2026, 5, 18, 16, 22, 48, 84, DateTimeKind.Utc).AddTicks(5552), "speaking_sessions", 30, "PRO", "monthly" },
                    { new Guid("10000002-0000-0000-0000-000000000003"), new DateTime(2026, 5, 18, 16, 22, 48, 84, DateTimeKind.Utc).AddTicks(5557), "writing_submissions", 20, "PRO", "monthly" },
                    { new Guid("10000002-0000-0000-0000-000000000004"), new DateTime(2026, 5, 18, 16, 22, 48, 84, DateTimeKind.Utc).AddTicks(5573), "mock_tests", 10, "PRO", "monthly" },
                    { new Guid("10000002-0000-0000-0000-000000000005"), new DateTime(2026, 5, 18, 16, 22, 48, 84, DateTimeKind.Utc).AddTicks(5580), "vocabulary_words", 50, "PRO", "daily" },
                    { new Guid("10000003-0000-0000-0000-000000000001"), new DateTime(2026, 5, 18, 16, 22, 48, 84, DateTimeKind.Utc).AddTicks(5585), "ai_chats", 300, "ELITE", "daily" },
                    { new Guid("10000003-0000-0000-0000-000000000002"), new DateTime(2026, 5, 18, 16, 22, 48, 84, DateTimeKind.Utc).AddTicks(5591), "speaking_sessions", 100, "ELITE", "monthly" },
                    { new Guid("10000003-0000-0000-0000-000000000003"), new DateTime(2026, 5, 18, 16, 22, 48, 84, DateTimeKind.Utc).AddTicks(5597), "writing_submissions", 100, "ELITE", "monthly" },
                    { new Guid("10000003-0000-0000-0000-000000000004"), new DateTime(2026, 5, 18, 16, 22, 48, 84, DateTimeKind.Utc).AddTicks(5603), "mock_tests", 30, "ELITE", "monthly" },
                    { new Guid("10000003-0000-0000-0000-000000000005"), new DateTime(2026, 5, 18, 16, 22, 48, 84, DateTimeKind.Utc).AddTicks(5608), "vocabulary_words", -1, "ELITE", "daily" },
                    { new Guid("10000004-0000-0000-0000-000000000001"), new DateTime(2026, 5, 18, 16, 22, 48, 84, DateTimeKind.Utc).AddTicks(5613), "ai_chats", -1, "ENTERPRISE", "daily" },
                    { new Guid("10000004-0000-0000-0000-000000000002"), new DateTime(2026, 5, 18, 16, 22, 48, 84, DateTimeKind.Utc).AddTicks(5625), "speaking_sessions", -1, "ENTERPRISE", "monthly" },
                    { new Guid("10000004-0000-0000-0000-000000000003"), new DateTime(2026, 5, 18, 16, 22, 48, 84, DateTimeKind.Utc).AddTicks(5631), "writing_submissions", -1, "ENTERPRISE", "monthly" },
                    { new Guid("10000004-0000-0000-0000-000000000004"), new DateTime(2026, 5, 18, 16, 22, 48, 84, DateTimeKind.Utc).AddTicks(5636), "mock_tests", -1, "ENTERPRISE", "monthly" },
                    { new Guid("10000004-0000-0000-0000-000000000005"), new DateTime(2026, 5, 18, 16, 22, 48, 84, DateTimeKind.Utc).AddTicks(5642), "vocabulary_words", -1, "ENTERPRISE", "daily" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_Action",
                table: "AuditLogs",
                column: "Action");

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_CreatedAtUtc",
                table: "AuditLogs",
                column: "CreatedAtUtc");

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_UserId",
                table: "AuditLogs",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_FeatureEntitlements_PlanId_Feature",
                table: "FeatureEntitlements",
                columns: new[] { "PlanId", "Feature" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Invoices_InvoiceNumber",
                table: "Invoices",
                column: "InvoiceNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Invoices_UserId",
                table: "Invoices",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_PaymentAttempts_CreatedAtUtc",
                table: "PaymentAttempts",
                column: "CreatedAtUtc");

            migrationBuilder.CreateIndex(
                name: "IX_PaymentAttempts_IpAddress",
                table: "PaymentAttempts",
                column: "IpAddress");

            migrationBuilder.CreateIndex(
                name: "IX_PaymentAttempts_UserId",
                table: "PaymentAttempts",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_IdempotencyKey",
                table: "Payments",
                column: "IdempotencyKey",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Payments_ProviderPaymentId",
                table: "Payments",
                column: "ProviderPaymentId");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_SubscriptionId",
                table: "Payments",
                column: "SubscriptionId");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_UserId",
                table: "Payments",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Subscriptions_PlanId",
                table: "Subscriptions",
                column: "PlanId");

            migrationBuilder.CreateIndex(
                name: "IX_Subscriptions_RazorpaySubscriptionId",
                table: "Subscriptions",
                column: "RazorpaySubscriptionId",
                unique: true,
                filter: "\"RazorpaySubscriptionId\" IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Subscriptions_Status",
                table: "Subscriptions",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_Subscriptions_StripeSubscriptionId",
                table: "Subscriptions",
                column: "StripeSubscriptionId",
                unique: true,
                filter: "\"StripeSubscriptionId\" IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Subscriptions_UserId",
                table: "Subscriptions",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UsageRecords_PeriodEnd",
                table: "UsageRecords",
                column: "PeriodEnd");

            migrationBuilder.CreateIndex(
                name: "IX_UsageRecords_UserId_Feature_PeriodStart",
                table: "UsageRecords",
                columns: new[] { "UserId", "Feature", "PeriodStart" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserProfiles_UserId",
                table: "UserProfiles",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_WebhookEvents_ProcessingStatus",
                table: "WebhookEvents",
                column: "ProcessingStatus");

            migrationBuilder.CreateIndex(
                name: "IX_WebhookEvents_Provider_ProviderEventId",
                table: "WebhookEvents",
                columns: new[] { "Provider", "ProviderEventId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AuditLogs");

            migrationBuilder.DropTable(
                name: "FeatureEntitlements");

            migrationBuilder.DropTable(
                name: "Invoices");

            migrationBuilder.DropTable(
                name: "PaymentAttempts");

            migrationBuilder.DropTable(
                name: "Payments");

            migrationBuilder.DropTable(
                name: "UsageRecords");

            migrationBuilder.DropTable(
                name: "UserProfiles");

            migrationBuilder.DropTable(
                name: "WebhookEvents");

            migrationBuilder.DropTable(
                name: "Subscriptions");

            migrationBuilder.DropTable(
                name: "SubscriptionPlans");
        }
    }
}
