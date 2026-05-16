using Lingoura.Application.Authentication.DTOs;
using Lingoura.Common.Results;
using MediatR;

namespace Lingoura.Application.Authentication.Commands.Register;

public sealed record RegisterCommand(
    string Email,
    string Password,
    string FirstName,
    string LastName) : IRequest<Result<AuthResponseDto>>;
