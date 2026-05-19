using Lingoura.Application.Billing.DTOs;
using Lingoura.Application.Common.Interfaces;
using Lingoura.Common.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Lingoura.Application.Billing.Queries.GetPlans;

public sealed class GetPlansQueryHandler(IApplicationDbContext db)
    : IRequestHandler<GetPlansQuery, Result<IReadOnlyList<SubscriptionPlanDto>>>
{
    public async Task<Result<IReadOnlyList<SubscriptionPlanDto>>> Handle(
        GetPlansQuery request, CancellationToken ct)
    {
        var plans = await db.SubscriptionPlans
            .Where(p => p.IsActive)
            .OrderBy(p => p.SortOrder)
            .Select(p => new SubscriptionPlanDto(
                p.Id, p.DisplayName,
                p.MonthlyPriceUsd, p.AnnualPriceUsd,
                p.MonthlyPriceInr, p.AnnualPriceInr,
                p.IsActive, p.SortOrder))
            .ToListAsync(ct);

        return Result.Success<IReadOnlyList<SubscriptionPlanDto>>(plans);
    }
}
