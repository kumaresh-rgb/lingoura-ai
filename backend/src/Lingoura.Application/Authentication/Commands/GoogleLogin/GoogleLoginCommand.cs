using Lingoura.Application.Authentication.DTOs;
using Lingoura.Common.Results;
using MediatR;

namespace Lingoura.Application.Authentication.Commands.GoogleLogin;

public sealed record GoogleLoginCommand(string IdToken) : IRequest<Result<AuthResponseDto>>;
