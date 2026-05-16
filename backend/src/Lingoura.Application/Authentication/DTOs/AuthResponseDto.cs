namespace Lingoura.Application.Authentication.DTOs;

public sealed record AuthResponseDto(
    string AccessToken,
    string RefreshToken,
    DateTime ExpiresAt,
    UserDto User);

public sealed record UserDto(Guid Id, string Email, string FirstName, string LastName);
