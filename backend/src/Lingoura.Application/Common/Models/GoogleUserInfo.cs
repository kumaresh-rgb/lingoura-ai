namespace Lingoura.Application.Common.Models;

public sealed record GoogleUserInfo(
    string GoogleUserId,
    string Email,
    string FirstName,
    string LastName,
    string? AvatarUrl,
    bool IsVerified);
