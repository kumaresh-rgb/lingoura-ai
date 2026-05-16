using Asp.Versioning;
using Lingoura.Application.Authentication.Commands.GoogleLogin;
using Lingoura.Application.Authentication.Commands.Login;
using Lingoura.Application.Authentication.Commands.Logout;
using Lingoura.Application.Authentication.Commands.RefreshToken;
using Lingoura.Application.Authentication.Commands.Register;
using Lingoura.Application.Authentication.DTOs;
using Lingoura.Shared.Responses;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Lingoura.Api.Controllers.V1;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/auth")]
public sealed class AuthController(ISender mediator) : ControllerBase
{
    [HttpPost("register")]
    [ProducesResponseType(typeof(ApiResponse<AuthResponseDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status409Conflict)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status422UnprocessableEntity)]
    public async Task<IActionResult> Register(
        [FromBody] RegisterRequestDto dto, CancellationToken ct)
    {
        var result = await mediator.Send(
            new RegisterCommand(dto.Email, dto.Password, dto.FirstName, dto.LastName), ct);

        if (!result.IsSuccess)
            return StatusCode(StatusCodes.Status409Conflict,
                ApiResponse.Fail(result.Error.Message, traceId: HttpContext.TraceIdentifier));

        return StatusCode(StatusCodes.Status201Created,
            ApiResponse<AuthResponseDto>.Ok(result.Value, "Registration successful",
                HttpContext.TraceIdentifier));
    }

    [HttpPost("login")]
    [ProducesResponseType(typeof(ApiResponse<AuthResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login(
        [FromBody] LoginRequestDto dto, CancellationToken ct)
    {
        var result = await mediator.Send(new LoginCommand(dto.Email, dto.Password), ct);

        if (!result.IsSuccess)
            return Unauthorized(ApiResponse.Fail(result.Error.Message,
                traceId: HttpContext.TraceIdentifier));

        return Ok(ApiResponse<AuthResponseDto>.Ok(result.Value, traceId: HttpContext.TraceIdentifier));
    }

    [HttpPost("refresh")]
    [ProducesResponseType(typeof(ApiResponse<AuthResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> RefreshToken(
        [FromBody] RefreshTokenRequestDto dto, CancellationToken ct)
    {
        var result = await mediator.Send(new RefreshTokenCommand(dto.RefreshToken), ct);

        if (!result.IsSuccess)
            return Unauthorized(ApiResponse.Fail(result.Error.Message,
                traceId: HttpContext.TraceIdentifier));

        return Ok(ApiResponse<AuthResponseDto>.Ok(result.Value, traceId: HttpContext.TraceIdentifier));
    }

    [HttpPost("logout")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> Logout(
        [FromBody] RefreshTokenRequestDto dto, CancellationToken ct)
    {
        await mediator.Send(new LogoutCommand(dto.RefreshToken), ct);
        return Ok(ApiResponse.Ok("Logged out successfully.", HttpContext.TraceIdentifier));
    }

    [HttpPost("google")]
    [ProducesResponseType(typeof(ApiResponse<AuthResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GoogleLogin(
        [FromBody] GoogleLoginRequestDto dto, CancellationToken ct)
    {
        var result = await mediator.Send(new GoogleLoginCommand(dto.IdToken), ct);

        if (!result.IsSuccess)
            return Unauthorized(ApiResponse.Fail(result.Error.Message,
                traceId: HttpContext.TraceIdentifier));

        return Ok(ApiResponse<AuthResponseDto>.Ok(result.Value, traceId: HttpContext.TraceIdentifier));
    }
}
