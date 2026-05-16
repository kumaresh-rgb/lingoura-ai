using Lingoura.Common.Results;
using MediatR;

namespace Lingoura.Application.Authentication.Commands.Logout;

public sealed record LogoutCommand(string RefreshToken) : IRequest<Result>;
