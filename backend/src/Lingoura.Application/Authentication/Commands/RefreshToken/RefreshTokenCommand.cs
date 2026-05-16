using Lingoura.Application.Authentication.DTOs;
using Lingoura.Common.Results;
using MediatR;

namespace Lingoura.Application.Authentication.Commands.RefreshToken;

public sealed record RefreshTokenCommand(string RefreshToken) : IRequest<Result<AuthResponseDto>>;
