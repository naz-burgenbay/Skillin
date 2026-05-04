using FluentAssertions;
using Skillin.Domain.Entities;
using Skillin.Domain.Enums;
using Skillin.Application.DTOs;
using Skillin.Infrastructure.Services;
using Skillin.Services;
using Skillin.Tests.Helpers;

namespace Skillin.Tests.Services;

public class AuthServiceTests
{
    private static AuthService CreateSut(out Skillin.Infrastructure.Data.AppDbContext context)
    {
        context = DbContextFactory.Create();
        var tokenService = new TokenService(JwtConfigFactory.Create());
        return new AuthService(context, tokenService);
    }

    [Fact]
    public async Task RegisterAsync_NewEmail_ReturnsSuccess()
    {
        var sut = CreateSut(out _);
        var request = new RegisterRequest { Email = "new@test.com", Password = "pass123", Role = UserRole.Student };

        var result = await sut.RegisterAsync(request);

        result.Success.Should().BeTrue();
        result.Data.Should().NotBeNull();
    }

    [Fact]
    public async Task RegisterAsync_NewEmail_ReturnsTokenAndCorrectEmail()
    {
        var sut = CreateSut(out _);
        var request = new RegisterRequest { Email = "user@test.com", Password = "pass123", Role = UserRole.Student };

        var result = await sut.RegisterAsync(request);

        result.Data!.Token.Should().NotBeNullOrWhiteSpace();
        result.Data.Email.Should().Be("user@test.com");
    }

    [Fact]
    public async Task RegisterAsync_NewEmail_EmailStoredLowercase()
    {
        var sut = CreateSut(out var context);
        var request = new RegisterRequest { Email = "UPPER@TEST.COM", Password = "pass123", Role = UserRole.Student };

        await sut.RegisterAsync(request);

        var stored = context.Users.Single();
        stored.Email.Should().Be("upper@test.com");
    }

    [Fact]
    public async Task RegisterAsync_NewEmail_PasswordIsHashed()
    {
        var sut = CreateSut(out var context);
        var request = new RegisterRequest { Email = "a@test.com", Password = "plaintext", Role = UserRole.Student };

        await sut.RegisterAsync(request);

        var stored = context.Users.Single();
        stored.PasswordHash.Should().NotBe("plaintext");
        BCrypt.Net.BCrypt.Verify("plaintext", stored.PasswordHash).Should().BeTrue();
    }

    [Fact]
    public async Task RegisterAsync_DuplicateEmail_ReturnsFalse()
    {
        var sut = CreateSut(out _);
        var request = new RegisterRequest { Email = "dup@test.com", Password = "pass", Role = UserRole.Student };
        await sut.RegisterAsync(request);

        var result = await sut.RegisterAsync(request);

        result.Success.Should().BeFalse();
        result.Data.Should().BeNull();
    }

    [Fact]
    public async Task RegisterAsync_DuplicateEmail_MessageIndicatesDuplicate()
    {
        var sut = CreateSut(out _);
        var request = new RegisterRequest { Email = "dup@test.com", Password = "pass", Role = UserRole.Student };
        await sut.RegisterAsync(request);

        var result = await sut.RegisterAsync(request);

        result.Message.Should().NotBeNullOrWhiteSpace();
    }

    [Fact]
    public async Task RegisterAsync_EmailCaseInsensitiveDuplicate_ReturnsFalse()
    {
        var sut = CreateSut(out _);
        await sut.RegisterAsync(new RegisterRequest { Email = "test@test.com", Password = "p", Role = UserRole.Student });

        var result = await sut.RegisterAsync(new RegisterRequest { Email = "TEST@TEST.COM", Password = "p", Role = UserRole.Student });

        result.Success.Should().BeFalse();
    }

    [Fact]
    public async Task LoginAsync_CorrectCredentials_ReturnsSuccess()
    {
        var sut = CreateSut(out _);
        await sut.RegisterAsync(new RegisterRequest { Email = "login@test.com", Password = "secret", Role = UserRole.Company });

        var result = await sut.LoginAsync(new LoginRequest { Email = "login@test.com", Password = "secret" });

        result.Success.Should().BeTrue();
        result.Data.Should().NotBeNull();
        result.Data!.Token.Should().NotBeNullOrWhiteSpace();
    }

    [Fact]
    public async Task LoginAsync_CorrectCredentials_EmailCaseInsensitive()
    {
        var sut = CreateSut(out _);
        await sut.RegisterAsync(new RegisterRequest { Email = "login@test.com", Password = "secret", Role = UserRole.Student });

        var result = await sut.LoginAsync(new LoginRequest { Email = "LOGIN@TEST.COM", Password = "secret" });

        result.Success.Should().BeTrue();
    }

    [Fact]
    public async Task LoginAsync_WrongPassword_ReturnsFalse()
    {
        var sut = CreateSut(out _);
        await sut.RegisterAsync(new RegisterRequest { Email = "a@test.com", Password = "correct", Role = UserRole.Student });

        var result = await sut.LoginAsync(new LoginRequest { Email = "a@test.com", Password = "wrong" });

        result.Success.Should().BeFalse();
        result.Data.Should().BeNull();
    }

    [Fact]
    public async Task LoginAsync_UnknownEmail_ReturnsFalse()
    {
        var sut = CreateSut(out _);

        var result = await sut.LoginAsync(new LoginRequest { Email = "ghost@test.com", Password = "any" });

        result.Success.Should().BeFalse();
        result.Data.Should().BeNull();
    }

    [Fact]
    public async Task LoginAsync_WrongPassword_AndUnknownEmail_ReturnSameMessage()
    {
        var sut = CreateSut(out _);
        await sut.RegisterAsync(new RegisterRequest { Email = "exists@test.com", Password = "correct", Role = UserRole.Student });

        var wrongPassword = await sut.LoginAsync(new LoginRequest { Email = "exists@test.com", Password = "wrong" });
        var unknownEmail  = await sut.LoginAsync(new LoginRequest { Email = "nobody@test.com", Password = "any" });

        wrongPassword.Message.Should().Be(unknownEmail.Message);
    }

    [Fact]
    public async Task LoginAsync_CorrectCredentials_ResponseContainsRole()
    {
        var sut = CreateSut(out _);
        await sut.RegisterAsync(new RegisterRequest { Email = "r@test.com", Password = "p", Role = UserRole.Company });

        var result = await sut.LoginAsync(new LoginRequest { Email = "r@test.com", Password = "p" });

        result.Data!.Role.Should().Be(UserRole.Company.ToString());
    }
}
