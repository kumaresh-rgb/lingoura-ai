using FluentAssertions;
using Lingoura.Api.Controllers.V1;
using Lingoura.Application.Authentication.Commands.GoogleLogin;
using Lingoura.Application.Authentication.Commands.Login;
using Lingoura.Application.Authentication.Commands.Logout;
using Lingoura.Application.Authentication.Commands.RefreshToken;
using Lingoura.Application.Authentication.Commands.Register;
using Lingoura.Application.Authentication.DTOs;
using Lingoura.Common.Results;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace Lingoura.Api.IntegrationTests.Controllers;

public sealed class AuthControllerTests
{
    // ── Shared fixtures ────────────────────────────────────────────────────

    private readonly Mock<ISender> _mediator = new();

    private AuthController CreateSut()
    {
        var ctrl = new AuthController(_mediator.Object);
        ctrl.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext()
        };
        return ctrl;
    }

    private static AuthResponseDto SampleAuth() => new(
        AccessToken:  "eyJhbGciOiJIUzI1NiJ9.test.sig",
        RefreshToken: "refresh-token-abc",
        ExpiresAt:    DateTime.UtcNow.AddHours(1),
        User: new UserDto(Guid.NewGuid(), "test@example.com", "Test", "User"));

    // ── Register ───────────────────────────────────────────────────────────

    [Fact]
    public async Task Register_ValidCommand_Returns201WithTokens()
    {
        _mediator
            .Setup(m => m.Send(It.IsAny<RegisterCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result.Success(SampleAuth()));

        var result = await CreateSut().Register(
            new("test@example.com", "Password1!@#", "Test", "User"), CancellationToken.None);

        var created = result.Should().BeOfType<ObjectResult>().Subject;
        created.StatusCode.Should().Be(StatusCodes.Status201Created);
    }

    [Fact]
    public async Task Register_DuplicateEmail_Returns409()
    {
        _mediator
            .Setup(m => m.Send(It.IsAny<RegisterCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result.Failure<AuthResponseDto>(
                Error.Conflict("Auth.DuplicateEmail", "Email already registered.")));

        var result = await CreateSut().Register(
            new("dup@example.com", "Password1!@#", "Test", "User"), CancellationToken.None);

        var conflict = result.Should().BeOfType<ObjectResult>().Subject;
        conflict.StatusCode.Should().Be(StatusCodes.Status409Conflict);
    }

    [Fact]
    public async Task Register_MediatorThrows_PropagatesException()
    {
        _mediator
            .Setup(m => m.Send(It.IsAny<RegisterCommand>(), It.IsAny<CancellationToken>()))
            .ThrowsAsync(new InvalidOperationException("DB error"));

        var act = () => CreateSut().Register(
            new("test@example.com", "Password1!@#", "Test", "User"), CancellationToken.None);

        await act.Should().ThrowAsync<InvalidOperationException>();
    }

    // ── Login ──────────────────────────────────────────────────────────────

    [Fact]
    public async Task Login_CorrectCredentials_Returns200WithTokens()
    {
        var auth = SampleAuth();
        _mediator
            .Setup(m => m.Send(It.IsAny<LoginCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result.Success(auth));

        var result = await CreateSut().Login(
            new("test@example.com", "Password1!@#"), CancellationToken.None);

        var ok = result.Should().BeOfType<OkObjectResult>().Subject;
        ok.StatusCode.Should().Be(StatusCodes.Status200OK);
    }

    [Fact]
    public async Task Login_WrongPassword_Returns401()
    {
        _mediator
            .Setup(m => m.Send(It.IsAny<LoginCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result.Failure<AuthResponseDto>(
                Error.Unauthorized("Auth.InvalidCredentials", "Invalid email or password.")));

        var result = await CreateSut().Login(
            new("test@example.com", "WrongPass!"), CancellationToken.None);

        result.Should().BeOfType<UnauthorizedObjectResult>();
    }

    [Fact]
    public async Task Login_UnknownEmail_Returns401()
    {
        _mediator
            .Setup(m => m.Send(It.IsAny<LoginCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result.Failure<AuthResponseDto>(
                Error.Unauthorized("Auth.InvalidCredentials", "Invalid email or password.")));

        var result = await CreateSut().Login(
            new("nobody@example.com", "Irrelevant1!"), CancellationToken.None);

        result.Should().BeOfType<UnauthorizedObjectResult>();
    }

    [Fact]
    public async Task Login_ForwardsCorrectCommandToMediatorator()
    {
        _mediator
            .Setup(m => m.Send(It.IsAny<LoginCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result.Success(SampleAuth()));

        await CreateSut().Login(
            new("user@test.com", "Pass1!@#abc"), CancellationToken.None);

        _mediator.Verify(m => m.Send(
            It.Is<LoginCommand>(c =>
                c.Email    == "user@test.com" &&
                c.Password == "Pass1!@#abc"),
            It.IsAny<CancellationToken>()), Times.Once);
    }

    // ── RefreshToken ───────────────────────────────────────────────────────

    [Fact]
    public async Task Refresh_ValidToken_Returns200WithNewTokens()
    {
        _mediator
            .Setup(m => m.Send(It.IsAny<RefreshTokenCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result.Success(SampleAuth()));

        var result = await CreateSut().RefreshToken(
            new("valid-refresh-token"), CancellationToken.None);

        result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task Refresh_ExpiredToken_Returns401()
    {
        _mediator
            .Setup(m => m.Send(It.IsAny<RefreshTokenCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result.Failure<AuthResponseDto>(
                Error.Unauthorized("Auth.TokenExpired", "Refresh token has expired.")));

        var result = await CreateSut().RefreshToken(
            new("expired-token"), CancellationToken.None);

        result.Should().BeOfType<UnauthorizedObjectResult>();
    }

    [Fact]
    public async Task Refresh_RevokedToken_Returns401()
    {
        _mediator
            .Setup(m => m.Send(It.IsAny<RefreshTokenCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result.Failure<AuthResponseDto>(
                Error.Unauthorized("Auth.TokenRevoked", "Refresh token has been revoked.")));

        var result = await CreateSut().RefreshToken(
            new("revoked-token"), CancellationToken.None);

        result.Should().BeOfType<UnauthorizedObjectResult>();
    }

    // ── Logout ─────────────────────────────────────────────────────────────

    [Fact]
    public async Task Logout_ValidRequest_Returns200()
    {
        _mediator
            .Setup(m => m.Send(It.IsAny<LogoutCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result.Success());

        var result = await CreateSut().Logout(
            new("token-to-revoke"), CancellationToken.None);

        result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task Logout_CallsMediatorWithRefreshToken()
    {
        _mediator
            .Setup(m => m.Send(It.IsAny<LogoutCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result.Success());

        const string token = "my-refresh-token";
        await CreateSut().Logout(new(token), CancellationToken.None);

        _mediator.Verify(m => m.Send(
            It.Is<LogoutCommand>(c => c.RefreshToken == token),
            It.IsAny<CancellationToken>()), Times.Once);
    }

    // ── Google Login ───────────────────────────────────────────────────────

    [Fact]
    public async Task GoogleLogin_ValidIdToken_Returns200WithTokens()
    {
        _mediator
            .Setup(m => m.Send(It.IsAny<GoogleLoginCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result.Success(SampleAuth()));

        var result = await CreateSut().GoogleLogin(
            new("valid.google.id.token"), CancellationToken.None);

        result.Should().BeOfType<OkObjectResult>();
    }

    [Fact]
    public async Task GoogleLogin_InvalidIdToken_Returns401()
    {
        _mediator
            .Setup(m => m.Send(It.IsAny<GoogleLoginCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result.Failure<AuthResponseDto>(
                Error.Unauthorized("Auth.InvalidGoogleToken", "Google authentication failed.")));

        var result = await CreateSut().GoogleLogin(
            new("fake-token"), CancellationToken.None);

        result.Should().BeOfType<UnauthorizedObjectResult>();
    }

    [Fact]
    public async Task GoogleLogin_ForwardsIdTokenToMediator()
    {
        _mediator
            .Setup(m => m.Send(It.IsAny<GoogleLoginCommand>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result.Success(SampleAuth()));

        const string idToken = "eyJhbGciOiJSUzI1NiJ9.google-payload.signature";
        await CreateSut().GoogleLogin(new(idToken), CancellationToken.None);

        _mediator.Verify(m => m.Send(
            It.Is<GoogleLoginCommand>(c => c.IdToken == idToken),
            It.IsAny<CancellationToken>()), Times.Once);
    }
}
