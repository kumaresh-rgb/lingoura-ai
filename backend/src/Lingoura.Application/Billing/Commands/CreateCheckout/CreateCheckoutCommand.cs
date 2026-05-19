using Lingoura.Common.Results;
using MediatR;

namespace Lingoura.Application.Billing.Commands.CreateCheckout;

public sealed record CreateCheckoutCommand(
    Guid UserId,
    string PlanId,
    string Interval,
    string SuccessUrl,
    string CancelUrl,
    string? ProviderHint,
    string? IpAddress,
    string? UserAgent) : IRequest<Result<CheckoutResult>>;

public sealed record CheckoutResult(
    string Provider,
    string SessionId,
    // Stripe fields
    string? CheckoutUrl,
    // Razorpay fields
    string? OrderId,
    long? AmountPaise,
    string? Currency,
    string? KeyId);
