using Lingoura.Application.Authentication.DTOs;
using Lingoura.Common.Results;
using MediatR;

namespace Lingoura.Application.Authentication.Commands.Login;

public sealed record LoginCommand(string Email, string Password) : IRequest<Result<AuthResponseDto>>;
