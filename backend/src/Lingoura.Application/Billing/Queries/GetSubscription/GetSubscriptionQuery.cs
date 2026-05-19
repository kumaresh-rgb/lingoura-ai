using Lingoura.Application.Billing.DTOs;
using Lingoura.Common.Results;
using MediatR;

namespace Lingoura.Application.Billing.Queries.GetSubscription;

public sealed record GetSubscriptionQuery(Guid UserId) : IRequest<Result<SubscriptionDto>>;
