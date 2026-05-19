using System.Text.Json;
using Lingoura.Application.Common.Interfaces;
using Lingoura.Domain.Entities;
using Lingoura.Domain.Enums;
using Lingoura.Infrastructure.Options;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Stripe;
using Stripe.Checkout;
using DomainSubscription = Lingoura.Domain.Entities.Subscription;
using StripeInvoice = Stripe.Invoice;

namespace Lingoura.Infrastructure.Services;

public sealed class StripeWebhookProcessor(
    IApplicationDbContext db,
    IRedisService redis,
    IOptions<StripeOptions> opts,
    ILogger<StripeWebhookProcessor> logger)
{
    private readonly string _webhookSecret = opts.Value.WebhookSecret;

    public async Task ProcessAsync(string rawBody, string stripeSignature, CancellationToken ct = default)
    {
        StripeConfiguration.ApiKey = opts.Value.SecretKey;

        // 1. Verify signature and parse event
        Event stripeEvent;
        try
        {
            stripeEvent = EventUtility.ConstructEvent(rawBody, stripeSignature, _webhookSecret);
        }
        catch (StripeException ex)
        {
            logger.LogWarning("Stripe signature verification failed: {Message}", ex.Message);
            throw new InvalidOperationException("Invalid Stripe signature", ex);
        }

        // 2. Idempotency — insert with UNIQUE constraint
        var webhookEvent = new WebhookEvent
        {
            Provider        = PaymentProvider.Stripe,
            ProviderEventId = stripeEvent.Id,
            EventType       = stripeEvent.Type,
            PayloadJson     = rawBody,
        };

        try
        {
            db.WebhookEvents.Add(webhookEvent);
            await db.SaveChangesAsync(ct);
        }
        catch (DbUpdateException)
        {
            // UNIQUE violation — duplicate delivery, safe to skip
            logger.LogInformation("Duplicate Stripe event {EventId} skipped", stripeEvent.Id);
            return;
        }

        // 3. Re-fetch from Stripe API (second independent verification)
        var eventService    = new EventService();
        var verifiedEvent   = await eventService.GetAsync(stripeEvent.Id, cancellationToken: ct);

        try
        {
            switch (verifiedEvent.Type)
            {
                case "checkout.session.completed":
                    await HandleCheckoutCompleted(verifiedEvent, ct);
                    break;
                case "customer.subscription.updated":
                    await HandleSubscriptionUpdated(verifiedEvent, ct);
                    break;
                case "customer.subscription.deleted":
                    await HandleSubscriptionDeleted(verifiedEvent, ct);
                    break;
                case "invoice.payment_failed":
                    await HandlePaymentFailed(verifiedEvent, ct);
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
            logger.LogError(ex, "Failed processing Stripe event {EventId}", stripeEvent.Id);
            webhookEvent.ProcessingStatus = WebhookEvent.Status.Failed;
            webhookEvent.ErrorMessage     = ex.Message;
            webhookEvent.RetryCount++;
        }
        finally
        {
            await db.SaveChangesAsync(ct);
        }
    }

    private async Task HandleCheckoutCompleted(Event evt, CancellationToken ct)
    {
        var session = evt.Data.Object as Session
            ?? throw new InvalidOperationException("Event object is not a Session");

        if (!Guid.TryParse(session.Metadata.GetValueOrDefault("userId"), out var userId))
            return;

        var planId         = session.Metadata.GetValueOrDefault("planId") ?? "PRO";
        var idempotencyKey = session.Metadata.GetValueOrDefault("idempotencyKey") ?? Guid.NewGuid().ToString();
        var intervalStr    = session.Metadata.GetValueOrDefault("interval") ?? "Monthly";
        var interval       = Enum.TryParse<BillingInterval>(intervalStr, out var iv) ? iv : BillingInterval.Monthly;

        var sub = await db.Subscriptions.FirstOrDefaultAsync(s => s.UserId == userId, ct)
            ?? DomainSubscription.CreateFree(userId);

        // Transactional upgrade
        await using var tx = await (db as Microsoft.EntityFrameworkCore.DbContext)!.Database.BeginTransactionAsync(ct);
        try
        {
            sub.PlanId               = planId;
            sub.Status               = SubscriptionStatus.Active;
            sub.Interval             = interval;
            sub.Provider             = PaymentProvider.Stripe;
            sub.StripeCustomerId     = session.CustomerId;
            sub.StripeSubscriptionId = session.SubscriptionId;
            sub.CurrentPeriodStart   = DateTime.UtcNow;
            sub.CurrentPeriodEnd     = interval == BillingInterval.Annual
                ? DateTime.UtcNow.AddYears(1)
                : DateTime.UtcNow.AddMonths(1);
            sub.UpdatedAtUtc         = DateTime.UtcNow;

            if (sub.Id == Guid.Empty)
                db.Subscriptions.Add(sub);

            db.Payments.Add(new Payment
            {
                UserId            = userId,
                SubscriptionId    = sub.Id,
                Provider          = PaymentProvider.Stripe,
                ProviderPaymentId = session.PaymentIntentId ?? session.Id,
                Amount            = (session.AmountTotal ?? 0) / 100m,
                Currency          = session.Currency.ToUpperInvariant(),
                Status            = PaymentStatus.Captured,
                IdempotencyKey    = idempotencyKey,
            });

            db.AuditLogs.Add(new AuditLog
            {
                UserId       = userId,
                Action       = "SUBSCRIPTION_UPGRADED",
                ResourceType = "subscription",
                ResourceId   = sub.Id.ToString(),
                NewValueJson = JsonSerializer.Serialize(new { planId, interval = interval.ToString() }),
            });

            await db.SaveChangesAsync(ct);
            await tx.CommitAsync(ct);

            // Invalidate subscription cache
            await redis.DeleteAsync($"sub:{userId}");
            logger.LogInformation("User {UserId} upgraded to {PlanId}", userId, planId);
        }
        catch
        {
            await tx.RollbackAsync(ct);
            throw;
        }
    }

    private async Task HandleSubscriptionUpdated(Event evt, CancellationToken ct)
    {
        var stripeSub = evt.Data.Object as Stripe.Subscription;
        if (stripeSub is null) return;

        var sub = await db.Subscriptions
            .FirstOrDefaultAsync(s => s.StripeSubscriptionId == stripeSub.Id, ct);
        if (sub is null) return;

        sub.CancelAtPeriodEnd = stripeSub.CancelAtPeriodEnd;
        sub.CurrentPeriodEnd  = stripeSub.CurrentPeriodEnd;
        sub.UpdatedAtUtc      = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);
        await redis.DeleteAsync($"sub:{sub.UserId}");
    }

    private async Task HandleSubscriptionDeleted(Event evt, CancellationToken ct)
    {
        var stripeSub = evt.Data.Object as Stripe.Subscription;
        if (stripeSub is null) return;

        var sub = await db.Subscriptions
            .FirstOrDefaultAsync(s => s.StripeSubscriptionId == stripeSub.Id, ct);
        if (sub is null) return;

        sub.Status        = SubscriptionStatus.Canceled;
        sub.PlanId        = SubscriptionPlan.Plans.Free;
        sub.CanceledAtUtc = DateTime.UtcNow;
        sub.UpdatedAtUtc  = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);
        await redis.DeleteAsync($"sub:{sub.UserId}");
        logger.LogInformation("Subscription {SubId} canceled and downgraded to FREE", sub.Id);
    }

    private async Task HandlePaymentFailed(Event evt, CancellationToken ct)
    {
        var invoice = evt.Data.Object as StripeInvoice;
        if (invoice?.SubscriptionId is null) return;

        var sub = await db.Subscriptions
            .FirstOrDefaultAsync(s => s.StripeSubscriptionId == invoice.SubscriptionId, ct);
        if (sub is null) return;

        sub.Status            = SubscriptionStatus.PastDue;
        sub.GracePeriodEndUtc = DateTime.UtcNow.AddDays(7);
        sub.UpdatedAtUtc      = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);
        await redis.DeleteAsync($"sub:{sub.UserId}");
        logger.LogWarning("Payment failed for subscription {SubId}", sub.Id);
    }
}
