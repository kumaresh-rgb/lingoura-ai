using Lingoura.Application.Common.Interfaces;
using StackExchange.Redis;

namespace Lingoura.Infrastructure.Services;

public sealed class RedisService(IConnectionMultiplexer redis) : IRedisService
{
    private readonly IDatabase _db = redis.GetDatabase();

    public async Task<long> IncrAsync(string key)
        => await _db.StringIncrementAsync(key);

    public async Task<long> DecrAsync(string key)
        => await _db.StringDecrementAsync(key);

    public async Task<bool> ExpireAsync(string key, TimeSpan ttl)
        => await _db.KeyExpireAsync(key, ttl);

    public async Task<bool> ExistsAsync(string key)
        => await _db.KeyExistsAsync(key);

    public async Task SetAsync(string key, string value, TimeSpan? ttl = null)
    {
        if (ttl.HasValue)
            await _db.StringSetAsync(key, value, ttl.Value);
        else
            await _db.StringSetAsync(key, value);
    }

    public async Task<string?> GetAsync(string key)
    {
        var val = await _db.StringGetAsync(key);
        return val.IsNullOrEmpty ? null : val.ToString();
    }

    public async Task<bool> DeleteAsync(string key)
        => await _db.KeyDeleteAsync(key);
}
