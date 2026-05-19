using Lingoura.Common.Results;
using MediatR;

namespace Lingoura.Application.Billing.Commands.CancelSubscription;

public sealed record CancelSubscriptionCommand(Guid UserId, string Reason) : IRequest<Result<Unit>>;
