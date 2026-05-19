using System.Text.Json;
using Lingoura.Application.Common.Interfaces;
using Lingoura.Domain.Entities;
using Lingoura.Domain.Enums;
using Lingoura.Infrastructure.Options;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Lingoura.Infrastructure.Services;

public sealed class RazorpayWebhookProcessor(
    IApplicationDbContext db,
    IRedisService redis,
    IRazorpayService razorpay,
    IOptions<RazorpayOptions> opts,
    ILogger<RazorpayWebhookProcessor> logger)
{
    public async Task ProcessAsync(
        string rawBody,
        string signature,
        CancellationToken ct = default)
    {
        // Signature already verified by Next.js relay and by WebhooksController before this call.
        // Re-verify here as defence in depth (second independent verification).
        if (!VerifySignature(rawBody, signature))
        {
            logger.LogWarning("Razorpay webhook signature failed second-pass verification");
            throw new InvalidOperationException("Invalid Razorpay signature");
        }

        using var doc  = JsonDocument.Parse(rawBody);
        var root       = doc.RootElement;
        var eventType  = root.GetProperty("event").GetString() ?? string.Empty;
        var eventId    = root.TryGetProperty("id", out var idEl) ? idEl.GetString() ?? Guid.NewGuid().ToString() : Guid.NewGuid().ToString();

        // Idempotency — insert with UNIQUE constraint
        var webhookEvent = new WebhookEvent
        {
            Provider        = PaymentProvider.Razorpay,
            ProviderEventId = eventId,
            EventType       = eventType,
            PayloadJson     = rawBody,
        };

        try
        {
            db.WebhookEvents.Add(webhookEvent);
            await db.SaveChangesAsync(ct);
        }
        catch (DbUpdateException)
        {
            logger.LogInformation("Duplicate Razorpay event {EventId} skipped", eventId);
            return;
        }

        try
        {
            switch (eventType)
            {
                case "payment.captured":
                    await HandlePaymentCaptured(root, ct);
                    break;
                case "subscription.charged":
                    await HandleSubscriptionCharged(root, ct);
                    break;
                case "subscription.cancelled":
                    await HandleSubscriptionCancelled(root, ct);
                    break;
                case "payment.failed":
                    await HandlePaymentFailed(root, ct);
                    break;
                default:
                    webhookEvent.ProcessingStatus = WebhookEvent.Status.Skipped;
                    break;
            }

            webhookEvent.ProcessingStatus = WebhookEvent.Status.Processed;
            webhookEvent.ProcessedAtUtc   = DateTime.UtcNow;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed processing Razorpay event {EventId}", eventId);
            webhookEvent.ProcessingStatus = WebhookEvent.Status.Failed;
            webhookEvent.ErrorMessage     = ex.Message;
            webhookEvent.RetryCount++;
        }
        finally
        {
            await db.SaveChangesAsync(ct);
        }
    }

    private async Task HandlePaymentCaptured(JsonElement root, CancellationToken ct)
    {
        var payment = root.GetProperty("payload").GetProperty("payment").GetProperty("entity");

        var paymentId = payment.GetProperty("id").GetString()!;
        var orderId   = payment.GetProperty("order_id").GetString()!;
        var amount    = payment.GetProperty("amount").GetInt64();
        var currency  = payment.GetProperty("currency").GetString() ?? "INR";

        // notes carry userId, planId, interval, idempotencyKey set during order creation
        var notes = payment.TryGetProperty("notes", out var notesEl) ? notesEl : default;

        if (!notes.ValueKind.Equals(JsonValueKind.Object))
        {
            logger.LogWarning("Razorpay payment {PaymentId} has no notes — cannot map to user", paymentId);
            return;
        }

        if (!Guid.TryParse(GetNote(notes, "userId"), out var userId)) return;

        var planId         = GetNote(notes, "planId") ?? "PRO";
        var idempotencyKey = GetNote(notes, "idempotencyKey") ?? orderId;
        var intervalStr    = GetNote(notes, "interval") ?? "Monthly";
        var interval       = Enum.TryParse<BillingInterval>(intervalStr, out var iv) ? iv : BillingInterval.Monthly;

        // Second-pass verify: fetch payment status from Razorpay API
        var isCapture = await razorpay.FetchPaymentStatusAsync(paymentId, ct);
        if (!isCapture)
        {
            logger.LogWarning("Razorpay payment {PaymentId} status not captured — skipping upgrade", paymentId);
            return;
        }

        var sub = await db.Subscriptions.FirstOrDefaultAsync(s => s.UserId == userId, ct)
            ?? Subscription.CreateFree(userId);

        await using var tx = await (db as Microsoft.EntityFrameworkCore.DbContext)!.Database.BeginTransactionAsync(ct);
        try
        {
            sub.PlanId                  = planId;
            sub.Status                  = SubscriptionStatus.Active;
            sub.Interval                = interval;
            sub.Provider                = PaymentProvider.Razorpay;
            sub.RazorpaySubscriptionId  = orderId; // order-based flow: store orderId as subscription ref
            sub.CurrentPeriodStart      = DateTime.UtcNow;
            sub.CurrentPeriodEnd   = interval == BillingInterval.Annual
                ? DateTime.UtcNow.AddYears(1)
                : DateTime.UtcNow.AddMonths(1);
            sub.UpdatedAtUtc       = DateTime.UtcNow;

            if (sub.Id == Guid.Empty) db.Subscriptions.Add(sub);

            db.Payments.Add(new Payment
            {
                UserId            = userId,
                SubscriptionId    = sub.Id,
                Provider          = PaymentProvider.Razorpay,
                ProviderPaymentId = paymentId,
                Amount            = amount / 100m,
                Currency          = currency.ToUpperInvariant(),
                Status            = PaymentStatus.Captured,
                IdempotencyKey    = idempotencyKey,
            });

            db.AuditLogs.Add(new AuditLog
            {
                UserId       = userId,
                Action       = "SUBSCRIPTION_UPGRADED",
                ResourceType = "subscription",
                ResourceId   = sub.Id.ToString(),
                NewValueJson = JsonSerializer.Serialize(new { planId, interval = interval.ToString(), provider = "razorpay" }),
            });

            await db.SaveChangesAsync(ct);
            await tx.CommitAsync(ct);

            await redis.DeleteAsync($"sub:{userId}");
            logger.LogInformation("User {UserId} upgraded to {PlanId} via Razorpay", userId, planId);
        }
        catch
        {
            await tx.RollbackAsync(ct);
            throw;
        }
    }

    private async Task HandleSubscriptionCharged(JsonElement root, CancellationToken ct)
    {
        var subEntity = root.GetProperty("payload").GetProperty("subscription").GetProperty("entity");
        var razorpaySubId = subEntity.GetProperty("id").GetString()!;

        var sub = await db.Subscriptions
            .FirstOrDefaultAsync(s => s.RazorpaySubscriptionId == razorpaySubId, ct);
        if (sub is null) return;

        var interval         = sub.Interval;
        sub.CurrentPeriodEnd = interval == BillingInterval.Annual
            ? sub.CurrentPeriodEnd.AddYears(1)
            : sub.CurrentPeriodEnd.AddMonths(1);
        sub.Status      = SubscriptionStatus.Active;
        sub.UpdatedAtUtc = DateTime.UtcNow;

        await db.SaveChangesAsync(ct);
        await redis.DeleteAsync($"sub:{sub.UserId}");
    }

    private async Task HandleSubscriptionCancelled(JsonElement root, CancellationToken ct)
    {
        var subEntity     = root.GetProperty("payload").GetProperty("subscription").GetProperty("entity");
        var razorpaySubId = subEntity.GetProperty("id").GetString()!;

        var sub = await db.Subscriptions
            .FirstOrDefaultAsync(s => s.RazorpaySubscriptionId == razorpaySubId, ct);
        if (sub is null) return;

        sub.Status        = SubscriptionStatus.Canceled;
        sub.PlanId        = SubscriptionPlan.Plans.Free;
        sub.CanceledAtUtc = DateTime.UtcNow;
        sub.UpdatedAtUtc  = DateTime.UtcNow;

        await db.SaveChangesAsync(ct);
        await redis.DeleteAsync($"sub:{sub.UserId}");
        logger.LogInformation("Razorpay subscription {SubId} cancelled — user downgraded to FREE", sub.Id);
    }

    private async Task HandlePaymentFailed(JsonElement root, CancellationToken ct)
    {
        var payment   = root.GetProperty("payload").GetProperty("payment").GetProperty("entity");
        var orderId   = payment.GetProperty("order_id").GetString()!;

        var sub = await db.Subscriptions
            .FirstOrDefaultAsync(s => s.RazorpaySubscriptionId == orderId, ct);
        if (sub is null) return;

        sub.Status            = SubscriptionStatus.PastDue;
        sub.GracePeriodEndUtc = DateTime.UtcNow.AddDays(7);
        sub.UpdatedAtUtc      = DateTime.UtcNow;

        await db.SaveChangesAsync(ct);
        await redis.DeleteAsync($"sub:{sub.UserId}");
        logger.LogWarning("Razorpay payment failed for order {OrderId}", orderId);
    }

    private bool VerifySignature(string rawBody, string signature)
    {
        using var hmac = new System.Security.Cryptography.HMACSHA256(
            System.Text.Encoding.UTF8.GetBytes(opts.Value.WebhookSecret));
        var hash     = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(rawBody));
        var expected = Convert.ToHexString(hash).ToLowerInvariant();
        return System.Security.Cryptography.CryptographicOperations.FixedTimeEquals(
            System.Text.Encoding.UTF8.GetBytes(expected),
            System.Text.Encoding.UTF8.GetBytes(signature));
    }

    private static string? GetNote(JsonElement notes, string key)
        => notes.TryGetProperty(key, out var el) ? el.GetString() : null;
}
