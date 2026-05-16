using FluentAssertions;
using Lingoura.Application.Authentication.Commands.Register;

namespace Lingoura.Application.Tests.Authentication;

public sealed class RegisterCommandValidatorTests
{
    private readonly RegisterCommandValidator _sut = new();

    [Fact]
    public void Valid_command_passes_validation()
    {
        var cmd = new RegisterCommand("user@example.com", "Password1!@#abc", "John", "Doe");
        var result = _sut.Validate(cmd);
        result.IsValid.Should().BeTrue();
    }

    [Theory]
    [InlineData("")]
    [InlineData("not-an-email")]
    [InlineData("missing@")]
    public void Invalid_email_fails_validation(string email)
    {
        var cmd    = new RegisterCommand(email, "Password1!@#abc", "John", "Doe");
        var result = _sut.Validate(cmd);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(cmd.Email));
    }

    [Theory]
    [InlineData("short1!A")]
    [InlineData("nouppercase1!abc")]
    [InlineData("NOLOWERCASE1!ABC")]
    [InlineData("NoSpecialChar12")]
    [InlineData("NoDigit!!abcABC")]
    public void Weak_password_fails_validation(string password)
    {
        var cmd    = new RegisterCommand("user@example.com", password, "John", "Doe");
        var result = _sut.Validate(cmd);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(cmd.Password));
    }

    [Theory]
    [InlineData("")]
    [InlineData("Invalid123")]
    public void Invalid_first_name_fails_validation(string firstName)
    {
        var cmd    = new RegisterCommand("user@example.com", "Password1!@#abc", firstName, "Doe");
        var result = _sut.Validate(cmd);
        result.IsValid.Should().BeFalse();
    }
}
