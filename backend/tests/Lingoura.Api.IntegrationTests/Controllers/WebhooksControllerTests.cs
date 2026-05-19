using FluentAssertions;
using Lingoura.Api.Controllers.V1;
using Lingoura.Application.Common.Interfaces;
using Lingoura.Infrastructure.Options;
using Lingoura.Infrastructure.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using Moq;
using System.Text;

namespace Lingoura.Api.IntegrationTests.Controllers;

public sealed class WebhooksControllerTests
{
    // ── Helpers ────────────────────────────────────────────────────────────

    private const string TestSecret = "test-internal-webhook-secret";

    private static IConfiguration WithSecret(string secret) =>
        new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?> { ["InternalWebhookSecret"] = secret })
            .Build();

    private static IConfiguration NoSecret() =>
        new ConfigurationBuilder().Build(); // no InternalWebhookSecret → dev mode (always passes)

    private static StripeWebhookProcessor BuildStripeProcessor()
    {
        var db = new Mock<IApplicationDbContext>();
        var redis = new Mock<IRedisService>();
        var opts = Options.Create(new StripeOptions()); // empty strings — processor not called in these tests
        var logger = NullLogger<StripeWebhookProcessor>.Instance;
        return new StripeWebhookProcessor(db.Object, redis.Object, opts, logger);
    }

    private static RazorpayWebhookProcessor BuildRazorpayProcessor()
    {
        var db = new Mock<IApplicationDbContext>();
        var redis = new Mock<IRedisService>();
        var razorpay = new Mock<IRazorpayService>();
        var opts = Options.Create(new RazorpayOptions());
        var logger = NullLogger<RazorpayWebhookProcessor>.Instance;
        return new RazorpayWebhookProcessor(db.Object, redis.Object, razorpay.Object, opts, logger);
    }

    private WebhooksController CreateSut(IConfiguration config) =>
        new(BuildStripeProcessor(), BuildRazorpayProcessor(), config,
            NullLogger<WebhooksController>.Instance);

    private static DefaultHttpContext BuildContext(
        string body = "{}",
        string? internalSecret = null,
        string? stripeSignature = null,
        string? razorpaySignature = null)
    {
        var ctx = new DefaultHttpContext();
        ctx.Request.Body = new MemoryStream(Encoding.UTF8.GetBytes(body));
        ctx.Request.ContentType = "application/json";

        if (internalSecret is not null)
            ctx.Request.Headers["X-Internal-Secret"] = internalSecret;
        if (stripeSignature is not null)
            ctx.Request.Headers["Stripe-Signature"] = stripeSignature;
        if (razorpaySignature is not null)
            ctx.Request.Headers["X-Razorpay-Signature"] = razorpaySignature;

        return ctx;
    }

    // ── Stripe webhook ─────────────────────────────────────────────────────

    [Fact]
    public async Task StripeWebhook_MissingInternalSecret_Returns401()
    {
        var sut = CreateSut(WithSecret(TestSecret));
        sut.ControllerContext = new ControllerContext
            { HttpContext = BuildContext() }; // no X-Internal-Secret

        var result = await sut.StripeWebhook(CancellationToken.None);

        result.Should().BeOfType<UnauthorizedResult>();
    }

    [Fact]
    public async Task StripeWebhook_WrongInternalSecret_Returns401()
    {
        var sut = CreateSut(WithSecret(TestSecret));
        sut.ControllerContext = new ControllerContext
            { HttpContext = BuildContext(internalSecret: "wrong-secret") };

        var result = await sut.StripeWebhook(CancellationToken.None);

        result.Should().BeOfType<UnauthorizedResult>();
    }

    [Fact]
    public async Task StripeWebhook_CorrectSecretButMissingStripeSignature_Returns400()
    {
        var sut = CreateSut(WithSecret(TestSecret));
        sut.ControllerContext = new ControllerContext
            { HttpContext = BuildContext(internalSecret: TestSecret) }; // no Stripe-Signature

        var result = await sut.StripeWebhook(CancellationToken.None);

        var bad = result.Should().BeOfType<BadRequestObjectResult>().Subject;
        bad.StatusCode.Should().Be(StatusCodes.Status400BadRequest);
    }

    [Fact]
    public async Task StripeWebhook_NoInternalSecretConfigured_PassesThroughToSignatureCheck()
    {
        // When InternalWebhookSecret is not set, IsInternalCall() returns true (dev mode).
        // The first rejection point then becomes the missing Stripe-Signature.
        var sut = CreateSut(NoSecret());
        sut.ControllerContext = new ControllerContext
            { HttpContext = BuildContext() }; // no Stripe-Signature header

        var result = await sut.StripeWebhook(CancellationToken.None);

        result.Should().BeOfType<BadRequestObjectResult>();
    }

    // ── Razorpay webhook ───────────────────────────────────────────────────

    [Fact]
    public async Task RazorpayWebhook_MissingInternalSecret_Returns401()
    {
        var sut = CreateSut(WithSecret(TestSecret));
        sut.ControllerContext = new ControllerContext
            { HttpContext = BuildContext() }; // no X-Internal-Secret

        var result = await sut.RazorpayWebhook(CancellationToken.None);

        result.Should().BeOfType<UnauthorizedResult>();
    }

    [Fact]
    public async Task RazorpayWebhook_WrongInternalSecret_Returns401()
    {
        var sut = CreateSut(WithSecret(TestSecret));
        sut.ControllerContext = new ControllerContext
            { HttpContext = BuildContext(internalSecret: "not-the-right-one") };

        var result = await sut.RazorpayWebhook(CancellationToken.None);

        result.Should().BeOfType<UnauthorizedResult>();
    }

    [Fact]
    public async Task RazorpayWebhook_CorrectSecretButMissingRazorpaySignature_Returns400()
    {
        var sut = CreateSut(WithSecret(TestSecret));
        sut.ControllerContext = new ControllerContext
            { HttpContext = BuildContext(internalSecret: TestSecret) }; // no X-Razorpay-Signature

        var result = await sut.RazorpayWebhook(CancellationToken.None);

        var bad = result.Should().BeOfType<BadRequestObjectResult>().Subject;
        bad.StatusCode.Should().Be(StatusCodes.Status400BadRequest);
    }

    [Fact]
    public async Task RazorpayWebhook_NoInternalSecretConfigured_PassesThroughToSignatureCheck()
    {
        var sut = CreateSut(NoSecret());
        sut.ControllerContext = new ControllerContext
            { HttpContext = BuildContext() }; // no X-Razorpay-Signature

        var result = await sut.RazorpayWebhook(CancellationToken.None);

        result.Should().BeOfType<BadRequestObjectResult>();
    }
}
