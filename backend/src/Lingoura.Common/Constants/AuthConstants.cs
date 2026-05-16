namespace Lingoura.Common.Constants;

public static class AuthConstants
{
    public const int AccessTokenExpiryMinutes = 15;
    public const int RefreshTokenExpiryDays   = 7;
    public const int MaxFailedLoginAttempts   = 5;
    public const int LockoutDurationMinutes   = 15;
    public const int MinPasswordLength        = 12;
    public const int MaxEmailLength           = 254;
    public const int MaxNameLength            = 100;
    public const int RefreshTokenByteLength   = 64;
}
