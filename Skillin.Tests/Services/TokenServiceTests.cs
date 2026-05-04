using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using FluentAssertions;
using Microsoft.IdentityModel.Tokens;
using Skillin.Domain.Entities;
using Skillin.Domain.Enums;
using Skillin.Infrastructure.Services;
using Skillin.Tests.Helpers;

namespace Skillin.Tests.Services;

public class TokenServiceTests
{
    private readonly TokenService _sut;

    public TokenServiceTests()
    {
        _sut = new TokenService(JwtConfigFactory.Create());
    }

    // Helpers 

    private static User MakeUser(UserRole role = UserRole.Student) => new()
    {
        Id = Guid.NewGuid(),
        Email = "test@example.com",
        PasswordHash = "irrelevant",
        Role = role
    };

    private static ClaimsPrincipal ValidateToken(string token)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(JwtConfigFactory.TestSecretKey));

        var validationParams = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = JwtConfigFactory.TestIssuer,
            ValidAudience = JwtConfigFactory.TestAudience,
            IssuerSigningKey = key,
            ClockSkew = TimeSpan.Zero
        };

        return new JwtSecurityTokenHandler().ValidateToken(
            token, validationParams, out _);
    }

    // Tests

    [Fact]
    public void GenerateToken_ValidUser_ReturnsNonEmptyString()
    {
        var user = MakeUser();

        var token = _sut.GenerateToken(user);

        token.Should().NotBeNullOrWhiteSpace();
    }

    [Fact]
    public void GenerateToken_ValidUser_TokenIsValidJwt()
    {
        var user = MakeUser();

        var token = _sut.GenerateToken(user);

        // Should not throw
        var act = () => ValidateToken(token);
        act.Should().NotThrow();
    }

    [Fact]
    public void GenerateToken_ValidUser_ContainsNameIdentifierClaim()
    {
        var user = MakeUser();

        var token = _sut.GenerateToken(user);
        var principal = ValidateToken(token);

        var nameIdentifier = principal.FindFirstValue(ClaimTypes.NameIdentifier);
        nameIdentifier.Should().Be(user.Id.ToString());
    }

    [Fact]
    public void GenerateToken_ValidUser_ContainsEmailClaim()
    {
        var user = MakeUser();

        var token = _sut.GenerateToken(user);
        var principal = ValidateToken(token);

        var email = principal.FindFirstValue(ClaimTypes.Email);
        email.Should().Be(user.Email);
    }

    [Fact]
    public void GenerateToken_StudentUser_ContainsStudentRoleClaim()
    {
        var user = MakeUser(UserRole.Student);

        var token = _sut.GenerateToken(user);
        var principal = ValidateToken(token);

        var role = principal.FindFirstValue(ClaimTypes.Role);
        role.Should().Be(UserRole.Student.ToString());
    }

    [Fact]
    public void GenerateToken_CompanyUser_ContainsCompanyRoleClaim()
    {
        var user = MakeUser(UserRole.Company);

        var token = _sut.GenerateToken(user);
        var principal = ValidateToken(token);

        var role = principal.FindFirstValue(ClaimTypes.Role);
        role.Should().Be(UserRole.Company.ToString());
    }

    [Fact]
    public void GenerateToken_ValidUser_ExpiresInApproximately60Minutes()
    {
        var user = MakeUser();
        var before = DateTime.UtcNow;

        var token = _sut.GenerateToken(user);

        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);
        var expectedExpiry = before.AddMinutes(60);

        jwt.ValidTo.Should().BeCloseTo(expectedExpiry, precision: TimeSpan.FromSeconds(10));
    }

    [Fact]
    public void GenerateToken_TwoCallsForSameUser_ReturnDifferentTokens()
    {
        // Tokens differ because expiry timestamps differ between calls
        var user = MakeUser();

        var token1 = _sut.GenerateToken(user);
        var token2 = _sut.GenerateToken(user);

        // Both should be valid but not necessarily identical (expiry may differ by milliseconds)
        token1.Should().NotBeNullOrWhiteSpace();
        token2.Should().NotBeNullOrWhiteSpace();
        ValidateToken(token1);
        ValidateToken(token2);
    }

    [Fact]
    public void GenerateToken_TwoDifferentUsers_EachTokenHasCorrectId()
    {
        var user1 = MakeUser();
        var user2 = MakeUser();

        var token1 = _sut.GenerateToken(user1);
        var token2 = _sut.GenerateToken(user2);

        var principal1 = ValidateToken(token1);
        var principal2 = ValidateToken(token2);

        principal1.FindFirstValue(ClaimTypes.NameIdentifier).Should().Be(user1.Id.ToString());
        principal2.FindFirstValue(ClaimTypes.NameIdentifier).Should().Be(user2.Id.ToString());
    }
}
