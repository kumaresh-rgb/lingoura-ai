using FluentValidation;
using Lingoura.Common.Constants;

namespace Lingoura.Application.Authentication.Commands.Register;

public sealed class RegisterCommandValidator : AbstractValidator<RegisterCommand>
{
    public RegisterCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .MaximumLength(AuthConstants.MaxEmailLength)
            .EmailAddress().WithMessage("Invalid email format.");

        RuleFor(x => x.Password)
            .NotEmpty()
            .MinimumLength(AuthConstants.MinPasswordLength)
            .Matches(@"[A-Z]").WithMessage("Password must contain an uppercase letter.")
            .Matches(@"[a-z]").WithMessage("Password must contain a lowercase letter.")
            .Matches(@"[0-9]").WithMessage("Password must contain a digit.")
            .Matches(@"[^a-zA-Z0-9]").WithMessage("Password must contain a special character.");

        RuleFor(x => x.FirstName)
            .NotEmpty()
            .MaximumLength(AuthConstants.MaxNameLength)
            .Matches(@"^[\p{L}\p{M}'\- ]+$").WithMessage("First name contains invalid characters.");

        RuleFor(x => x.LastName)
            .NotEmpty()
            .MaximumLength(AuthConstants.MaxNameLength)
            .Matches(@"^[\p{L}\p{M}'\- ]+$").WithMessage("Last name contains invalid characters.");
    }
}
