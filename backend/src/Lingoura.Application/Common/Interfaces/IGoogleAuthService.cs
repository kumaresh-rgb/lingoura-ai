using Lingoura.Application.Common.Models;

namespace Lingoura.Application.Common.Interfaces;

public interface IGoogleAuthService
{
    Task<GoogleUserInfo?> ValidateGoogleTokenAsync(string idToken, CancellationToken ct = default);
}
