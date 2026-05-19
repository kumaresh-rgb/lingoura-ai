namespace Lingoura.Application.Common.Interfaces;

public interface IRedisService
{
    Task<long> IncrAsync(string key);
    Task<bool> ExpireAsync(string key, TimeSpan ttl);
    Task<bool> ExistsAsync(string key);
    Task SetAsync(string key, string value, TimeSpan? ttl = null);
    Task<string?> GetAsync(string key);
    Task<bool> DeleteAsync(string key);
    Task<long> DecrAsync(string key);
}
