using Lingoura.Application.Billing.DTOs;
using Lingoura.Common.Results;
using MediatR;

namespace Lingoura.Application.Billing.Queries.GetPlans;

public sealed record GetPlansQuery : IRequest<Result<IReadOnlyList<SubscriptionPlanDto>>>;
