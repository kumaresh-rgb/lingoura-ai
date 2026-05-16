namespace Lingoura.Application.Authentication.DTOs;

public sealed record RegisterRequestDto(string Email, string Password, string FirstName, string LastName);
