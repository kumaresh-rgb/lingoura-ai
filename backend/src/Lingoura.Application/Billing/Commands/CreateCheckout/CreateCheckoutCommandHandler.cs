using Lingoura.Application.Common.Interfaces;
using Lingoura.Common.Results;
using Lingoura.Domain.Entities;
using Lingoura.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Lingoura.Application.Billing.Commands.CreateCheckout;

public sealed class CreateCheckoutCommandHandler(
    IApplicationDbContext db,
    IStripeService stripe,
    IRazorpayService razorpay,
    UserManager<ApplicationUser> userManager,
    ILogger<CreateCheckoutCommandHandler> logger)
    : IRequestHandler<CreateCheckoutCommand, Result<CheckoutResult>>
{
    private static readonly string[] ValidPlans = ["PRO", "ELITE", "ENTERPRISE"];

    public async Task<Result<CheckoutResult>> Handle(
        CreateCheckoutCommand cmd, CancellationToken ct)
    {
        // 1. Validate plan
        if (!ValidPlans.Contains(cmd.PlanId, StringComparer.OrdinalIgnoreCase))
            return Result.Failure<CheckoutResult>(
                Error.Validation("Billing.InvalidPlan", "Invalid plan selected."));

        var interval = cmd.Interval.Equals("annual", StringComparison.OrdinalIgnoreCase)
            ? BillingInterval.Annual
            : BillingInterval.Monthly;

        // 2. Load user
        var user = await userManager.FindByIdAsync(cmd.UserId.ToString());
        if (user is null)
            return Result.Failure<CheckoutResult>(Error.NotFound("User.NotFound", "User not found."));

        // 3. Load or create subscription record
        var sub = await db.Subscriptions
            .Where(s => s.UserId == cmd.UserId)
            .FirstOrDefaultAsync(ct)
            ?? Subscription.CreateFree(cmd.UserId);

        // 4. Determine provider — backend decides, hint is just convenience
        //    In production, replace with proper geo-IP lookup service
        var provider = DetermineProvider(cmd.ProviderHint);

        // 5. Generate idempotency key
        var idempotencyKey = Guid.NewGuid().ToString();

        // 6. Log payment attempt
        db.PaymentAttempts.Add(new PaymentAttempt
        {
            UserId    = cmd.UserId,
            PlanId    = cmd.PlanId,
            Provider  = provider,
            IpAddress = cmd.IpAddress,
            UserAgent = cmd.UserAgent,
            Outcome   = PaymentAttempt.Outcomes.Initiated,
        });
        await db.SaveChangesAsync(ct);

        // 7. Create checkout with chosen provider
        if (provider == PaymentProvider.Razorpay)
        {
            var order = await razorpay.CreateOrderAsync(user, cmd.PlanId, interval, idempotencyKey, ct);
            logger.LogInformation("Razorpay order created for user {UserId}: {OrderId}", cmd.UserId, order.OrderId);

            return Result.Success(new CheckoutResult(
                Provider:     "razorpay",
                SessionId:    idempotencyKey,
                CheckoutUrl:  null,
                OrderId:      order.OrderId,
                AmountPaise:  order.AmountPaise,
                Currency:     order.Currency,
                KeyId:        order.KeyId));
        }
        else
        {
            var session = await stripe.CreateCheckoutSessionAsync(
                user, sub, cmd.PlanId, interval, cmd.SuccessUrl, cmd.CancelUrl, idempotencyKey, ct);
            logger.LogInformation("Stripe session created for user {UserId}: {SessionId}", cmd.UserId, session.SessionId);

            return Result.Success(new CheckoutResult(
                Provider:    "stripe",
                SessionId:   session.SessionId,
                CheckoutUrl: session.CheckoutUrl,
                OrderId:     null,
                AmountPaise: null,
                Currency:    null,
                KeyId:       null));
        }
    }

    private static PaymentProvider DetermineProvider(string? hint)
    {
        // Production: use MaxMind or Azure Maps IP Geolocation
        // For now: respect hint if it is "razorpay", else default to Stripe
        return hint?.Equals("razorpay", StringComparison.OrdinalIgnoreCase) == true
            ? PaymentProvider.Razorpay
            : PaymentProvider.Stripe;
    }
}
