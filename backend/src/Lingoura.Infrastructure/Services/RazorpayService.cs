using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Lingoura.Application.Common.Interfaces;
using Lingoura.Domain.Entities;
using Lingoura.Domain.Enums;
using Lingoura.Infrastructure.Options;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Lingoura.Infrastructure.Services;

/// <summary>
/// Razorpay integration using HttpClient directly.
/// The official .NET SDK is unmaintained — direct HTTP is more reliable.
/// </summary>
public sealed class RazorpayService(
    HttpClient httpClient,
    IOptions<RazorpayOptions> opts,
    ILogger<RazorpayService> logger)
    : IRazorpayService
{
    private readonly RazorpayOptions _opts = opts.Value;

    public async Task<RazorpayOrderResult> CreateOrderAsync(
        ApplicationUser user,
        string planId,
        BillingInterval interval,
        string idempotencyKey,
        CancellationToken ct = default)
    {
        var amountPaise = GetAmountPaise(planId, interval);
        if (amountPaise <= 0)
            throw new InvalidOperationException($"No Razorpay price configured for plan {planId} / {interval}");

        var payload = new
        {
            amount   = amountPaise,
            currency = "INR",
            receipt  = idempotencyKey[..Min(40, idempotencyKey.Length)],
            notes    = new { userId = user.Id.ToString(), planId, interval = interval.ToString() },
        };

        var request = new HttpRequestMessage(HttpMethod.Post, "https://api.razorpay.com/v1/orders")
        {
            Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json"),
        };
        SetBasicAuth(request);

        var response = await httpClient.SendAsync(request, ct);
        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync(ct);
        using var doc = JsonDocument.Parse(json);
        var root = doc.RootElement;

        var orderId = root.GetProperty("id").GetString()!;
        logger.LogInformation("Razorpay order {OrderId} created for user {UserId}", orderId, user.Id);

        return new RazorpayOrderResult(orderId, amountPaise, "INR", _opts.KeyId, idempotencyKey);
    }

    public bool VerifyPaymentSignature(string orderId, string paymentId, string signature)
    {
        var payload = $"{orderId}|{paymentId}";
        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(_opts.KeySecret));
        var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(payload));
        var expected = Convert.ToHexString(hash).ToLowerInvariant();
        return CryptographicOperations.FixedTimeEquals(
            Encoding.UTF8.GetBytes(expected),
            Encoding.UTF8.GetBytes(signature));
    }

    public async Task<bool> FetchPaymentStatusAsync(string paymentId, CancellationToken ct = default)
    {
        var request = new HttpRequestMessage(HttpMethod.Get,
            $"https://api.razorpay.com/v1/payments/{paymentId}");
        SetBasicAuth(request);

        var response = await httpClient.SendAsync(request, ct);
        if (!response.IsSuccessStatusCode) return false;

        var json = await response.Content.ReadAsStringAsync(ct);
        using var doc = JsonDocument.Parse(json);
        var status = doc.RootElement.GetProperty("status").GetString();
        return status == "captured";
    }

    private void SetBasicAuth(HttpRequestMessage request)
    {
        var credentials = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{_opts.KeyId}:{_opts.KeySecret}"));
        request.Headers.Authorization = new AuthenticationHeaderValue("Basic", credentials);
    }

    private long GetAmountPaise(string planId, BillingInterval interval) =>
        // Amounts in paise (1 INR = 100 paise). Prices include 18% GST.
        // Formula: USD price × ₹96.46/$ × 1.18 GST, rounded to nearest rupee.
        (planId.ToUpperInvariant(), interval) switch
        {
            ("PRO",   BillingInterval.Monthly) => 227700L,   // $20 → ₹2,277 incl. GST
            ("PRO",   BillingInterval.Annual)  => 2049600L,  // $15×12 → ₹20,496/yr incl. GST
            ("ELITE", BillingInterval.Monthly) => 443900L,   // $39 → ₹4,439 incl. GST
            ("ELITE", BillingInterval.Annual)  => 3300000L,  // $29×12 → ₹33,000/yr incl. GST
            _ => 0L,
        };

    private static int Min(int a, int b) => a < b ? a : b;
}
