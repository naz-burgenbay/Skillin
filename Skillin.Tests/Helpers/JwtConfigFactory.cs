using Microsoft.Extensions.Configuration;

namespace Skillin.Tests.Helpers;

public static class JwtConfigFactory
{
    public const string TestSecretKey = "TestSecretKey_ForUnitTests_32Chars!";
    public const string TestIssuer = "skillin-test-issuer";
    public const string TestAudience = "skillin-test-audience";
    
    public static IConfiguration Create()
    {
        var settings = new Dictionary<string, string?>
        {
            ["JwtSettings:SecretKey"] = TestSecretKey,
            ["JwtSettings:Issuer"]    = TestIssuer,
            ["JwtSettings:Audience"]  = TestAudience,
        };

        return new ConfigurationBuilder()
            .AddInMemoryCollection(settings)
            .Build();
    }
}
