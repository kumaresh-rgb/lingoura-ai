using Lingoura.Application.Common.Interfaces;
using Lingoura.Common.Results;
using Lingoura.Domain.Entities;
using Lingoura.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Lingoura.Application.Billing.Commands.CancelSubscription;

public sealed class CancelSubscriptionCommandHandler(
    IApplicationDbContext db,
    IStripeService stripe,
    IRazorpayService razorpay,
    ILogger<CancelSubscriptionCommandHandler> logger)
    : IRequestHandler<CancelSubscriptionCommand, Result<Unit>>
{
    public async Task<Result<Unit>> Handle(CancelSubscriptionCommand cmd, CancellationToken ct)
    {
        var sub = await db.Subscriptions
            .Where(s => s.UserId == cmd.UserId && s.Status == SubscriptionStatus.Active)
            .FirstOrDefaultAsync(ct);

        if (sub is null)
            return Result.Failure<Unit>(Error.NotFound("Billing.NoActiveSubscription", "No active subscription found."));

        if (sub.PlanId == SubscriptionPlan.Plans.Free)
            return Result.Failure<Unit>(Error.Validation("Billing.FreePlan", "Cannot cancel a free plan."));

        // Cancel at period end — user retains access until then
        sub.CancelAtPeriodEnd = true;
        sub.CanceledAtUtc     = DateTime.UtcNow;
        sub.UpdatedAtUtc      = DateTime.UtcNow;

        // Propagate to provider
        if (sub.Provider == PaymentProvider.Stripe && sub.StripeSubscriptionId is not null)
            await stripe.CancelSubscriptionAtPeriodEndAsync(sub.StripeSubscriptionId, ct);

        // Audit log
        db.AuditLogs.Add(new AuditLog
        {
            UserId       = cmd.UserId,
            Action       = "SUBSCRIPTION_CANCEL_REQUESTED",
            ResourceType = "subscription",
            ResourceId   = sub.Id.ToString(),
            NewValueJson = $"{{\"reason\":\"{cmd.Reason}\"}}",
        });

        await db.SaveChangesAsync(ct);
        logger.LogInformation("User {UserId} requested subscription cancellation", cmd.UserId);

        return Result.Success(Unit.Value);
    }
}
