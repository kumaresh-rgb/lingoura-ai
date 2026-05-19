using Lingoura.Application.Common.Interfaces;
using Lingoura.Domain.Entities;
using Lingoura.Domain.Enums;
using Lingoura.Infrastructure.Options;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Stripe;
using Stripe.Checkout;
using DomainSubscription = Lingoura.Domain.Entities.Subscription;

namespace Lingoura.Infrastructure.Services;

public sealed class StripeService(
    IOptions<StripeOptions> opts,
    ILogger<StripeService> logger)
    : IStripeService
{
    private readonly StripeOptions _opts = opts.Value;

    public async Task<StripeCheckoutResult> CreateCheckoutSessionAsync(
        ApplicationUser user,
        DomainSubscription subscription,
        string planId,
        BillingInterval interval,
        string successUrl,
        string cancelUrl,
        string idempotencyKey,
        CancellationToken ct = default)
    {
        StripeConfiguration.ApiKey = _opts.SecretKey;

        var priceId = GetPriceId(planId, interval);
        if (string.IsNullOrEmpty(priceId))
            throw new InvalidOperationException($"No Stripe price configured for plan {planId} / {interval}");

        // Reuse existing Stripe customer if available
        var customerId = subscription.StripeCustomerId;
        if (string.IsNullOrEmpty(customerId))
        {
            var customerService = new CustomerService();
            var customer = await customerService.CreateAsync(new CustomerCreateOptions
            {
                Email    = user.Email,
                Name     = $"{user.FirstName} {user.LastName}",
                Metadata = new() { ["userId"] = user.Id.ToString() },
            }, cancellationToken: ct);
            customerId = customer.Id;
        }

        var sessionService = new SessionService();
        var session = await sessionService.CreateAsync(new SessionCreateOptions
        {
            Customer           = customerId,
            Mode               = "subscription",
            LineItems = [new() { Price = priceId, Quantity = 1 }],
            SuccessUrl         = successUrl,
            CancelUrl          = cancelUrl,
            ClientReferenceId  = user.Id.ToString(),
            Metadata = new()
            {
                ["userId"]         = user.Id.ToString(),
                ["planId"]         = planId,
                ["interval"]       = interval.ToString(),
                ["idempotencyKey"] = idempotencyKey,
            },
        }, new RequestOptions { IdempotencyKey = idempotencyKey }, ct);

        logger.LogInformation("Stripe session {SessionId} created for user {UserId}", session.Id, user.Id);
        return new StripeCheckoutResult(session.Url, session.Id, idempotencyKey);
    }

    public async Task<string> CreateCustomerPortalAsync(
        string stripeCustomerId, string returnUrl, CancellationToken ct = default)
    {
        StripeConfiguration.ApiKey = _opts.SecretKey;
        var service = new Stripe.BillingPortal.SessionService();
        var portal  = await service.CreateAsync(new Stripe.BillingPortal.SessionCreateOptions
        {
            Customer  = stripeCustomerId,
            ReturnUrl = returnUrl,
        }, cancellationToken: ct);
        return portal.Url;
    }

    public async Task CancelSubscriptionAtPeriodEndAsync(string stripeSubscriptionId, CancellationToken ct = default)
    {
        StripeConfiguration.ApiKey = _opts.SecretKey;
        var service = new SubscriptionService();
        await service.UpdateAsync(stripeSubscriptionId,
            new SubscriptionUpdateOptions { CancelAtPeriodEnd = true },
            cancellationToken: ct);
    }

    public async Task ReactivateSubscriptionAsync(string stripeSubscriptionId, CancellationToken ct = default)
    {
        StripeConfiguration.ApiKey = _opts.SecretKey;
        var service = new SubscriptionService();
        await service.UpdateAsync(stripeSubscriptionId,
            new SubscriptionUpdateOptions { CancelAtPeriodEnd = false },
            cancellationToken: ct);
    }

    private string GetPriceId(string planId, BillingInterval interval) =>
        (planId.ToUpperInvariant(), interval) switch
        {
            ("PRO",        BillingInterval.Monthly) => _opts.PriceIds.ProMonthly,
            ("PRO",        BillingInterval.Annual)  => _opts.PriceIds.ProAnnual,
            ("ELITE",      BillingInterval.Monthly) => _opts.PriceIds.EliteMonthly,
            ("ELITE",      BillingInterval.Annual)  => _opts.PriceIds.EliteAnnual,
            ("ENTERPRISE", BillingInterval.Monthly) => _opts.PriceIds.EnterpriseMonthly,
            ("ENTERPRISE", BillingInterval.Annual)  => _opts.PriceIds.EnterpriseAnnual,
            _ => string.Empty,
        };
}
