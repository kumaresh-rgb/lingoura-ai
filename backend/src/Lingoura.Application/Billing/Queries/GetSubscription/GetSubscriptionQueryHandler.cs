using Lingoura.Application.Billing.DTOs;
using Lingoura.Application.Common.Interfaces;
using Lingoura.Common.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Lingoura.Application.Billing.Queries.GetSubscription;

public sealed class GetSubscriptionQueryHandler(IApplicationDbContext db)
    : IRequestHandler<GetSubscriptionQuery, Result<SubscriptionDto>>
{
    public async Task<Result<SubscriptionDto>> Handle(
        GetSubscriptionQuery request, CancellationToken ct)
    {
        var sub = await db.Subscriptions
            .Where(s => s.UserId == request.UserId)
            .OrderByDescending(s => s.CreatedAtUtc)
            .FirstOrDefaultAsync(ct);

        if (sub is null)
            return Result.Failure<SubscriptionDto>(Error.NotFound("Billing.NoSubscription", "No subscription found."));

        return Result.Success(new SubscriptionDto(
            sub.Id, sub.PlanId, sub.Status.ToString(),
            sub.Provider?.ToString(), sub.Interval.ToString(),
            sub.CurrentPeriodStart, sub.CurrentPeriodEnd,
            sub.CancelAtPeriodEnd, sub.CanceledAtUtc));
    }
}
