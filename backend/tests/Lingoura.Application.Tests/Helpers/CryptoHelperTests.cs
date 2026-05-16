using FluentAssertions;
using Lingoura.Common.Helpers;

namespace Lingoura.Application.Tests.Helpers;

public sealed class CryptoHelperTests
{
    [Fact]
    public void GenerateSecureToken_returns_non_empty_url_safe_string()
    {
        var token = CryptoHelper.GenerateSecureToken();
        token.Should().NotBeNullOrWhiteSpace();
        token.Should().NotContain("+").And.NotContain("/").And.NotContain("=");
    }

    [Fact]
    public void GenerateSecureToken_returns_unique_values()
    {
        var t1 = CryptoHelper.GenerateSecureToken();
        var t2 = CryptoHelper.GenerateSecureToken();
        t1.Should().NotBe(t2);
    }

    [Fact]
    public void HashToken_is_deterministic()
    {
        var token = CryptoHelper.GenerateSecureToken();
        var h1    = CryptoHelper.HashToken(token);
        var h2    = CryptoHelper.HashToken(token);
        h1.Should().Be(h2);
    }

    [Fact]
    public void HashToken_produces_different_hashes_for_different_inputs()
    {
        var h1 = CryptoHelper.HashToken("token-a");
        var h2 = CryptoHelper.HashToken("token-b");
        h1.Should().NotBe(h2);
    }

    [Fact]
    public void SecureEquals_returns_true_for_equal_strings()
    {
        CryptoHelper.SecureEquals("abc", "abc").Should().BeTrue();
    }

    [Fact]
    public void SecureEquals_returns_false_for_different_strings()
    {
        CryptoHelper.SecureEquals("abc", "xyz").Should().BeFalse();
    }
}
