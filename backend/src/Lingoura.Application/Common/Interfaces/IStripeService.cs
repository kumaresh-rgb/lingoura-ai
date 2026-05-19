using Lingoura.Domain.Entities;
using Lingoura.Domain.Enums;

namespace Lingoura.Application.Common.Interfaces;

public sealed record StripeCheckoutResult(
    string CheckoutUrl,
    string SessionId,
    string IdempotencyKey);

public interface IStripeService
{
    Task<StripeCheckoutResult> CreateCheckoutSessionAsync(
        ApplicationUser user,
        Subscription subscription,
        string planId,
        BillingInterval interval,
        string successUrl,
        string cancelUrl,
        string idempotencyKey,
        CancellationToken ct = default);

    Task<string> CreateCustomerPortalAsync(string stripeCustomerId, string returnUrl, CancellationToken ct = default);

    Task CancelSubscriptionAtPeriodEndAsync(string stripeSubscriptionId, CancellationToken ct = default);

    Task ReactivateSubscriptionAsync(string stripeSubscriptionId, CancellationToken ct = default);
}
