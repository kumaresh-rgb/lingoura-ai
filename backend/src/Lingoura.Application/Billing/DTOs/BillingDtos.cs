using Lingoura.Domain.Enums;

namespace Lingoura.Application.Billing.DTOs;

public sealed record SubscriptionPlanDto(
    string Id,
    string DisplayName,
    decimal MonthlyPriceUsd,
    decimal AnnualPriceUsd,
    decimal MonthlyPriceInr,
    decimal AnnualPriceInr,
    bool IsActive,
    int SortOrder);

public sealed record SubscriptionDto(
    Guid Id,
    string PlanId,
    string Status,
    string? Provider,
    string Interval,
    DateTime CurrentPeriodStart,
    DateTime CurrentPeriodEnd,
    bool CancelAtPeriodEnd,
    DateTime? CanceledAtUtc);

public sealed record CreateCheckoutRequestDto(
    string Plan,
    string Interval,           // "monthly" | "annual"
    string SuccessUrl,
    string CancelUrl,
    string? ProviderHint);     // "stripe" | "razorpay" — hint only, server decides

public sealed record StripeCheckoutResponseDto(
    string CheckoutUrl,
    string SessionId,
    string Provider);

public sealed record RazorpayCheckoutResponseDto(
    string OrderId,
    long AmountPaise,
    string Currency,
    string KeyId,
    string SessionId,
    string Provider);

public sealed record SessionStatusDto(
    string SessionId,
    string Status,
    string? PlanId,
    string? Message);

public sealed record UsageItemDto(
    string Feature,
    int Used,
    int Limit,
    string ResetAt);

public sealed record UsageSummaryDto(
    IReadOnlyList<UsageItemDto> Records,
    DateTime BillingPeriodStart,
    DateTime BillingPeriodEnd);

public sealed record ConsumeUsageRequestDto(
    string Feature,
    string IdempotencyKey,
    string? Context);

public sealed record ConsumeUsageResponseDto(
    bool Allowed,
    int Remaining,
    string ResetAt,
    string? DenialReason);
