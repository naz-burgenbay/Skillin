using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Skillin.Application.DTOs;
using Skillin.Controllers;
using Skillin.Infrastructure.Services;
using Skillin.Services;
using Skillin.Tests.Helpers;

namespace Skillin.Tests.Controllers;

public class AuthControllerTests
{
    private static AuthController CreateController()
    {
        var context = DbContextFactory.Create();
        var tokenService = new TokenService(JwtConfigFactory.Create());
        var authService = new AuthService(context, tokenService);
        return new AuthController(authService);
    }

    [Fact]
    public async Task Register_ValidRequest_Returns200WithData()
    {
        var controller = CreateController();
        var request = new RegisterRequest { Email = "new@test.com", Password = "pass123", Role = Skillin.Domain.Enums.UserRole.Student };

        var result = await controller.Register(request);

        var ok = result as OkObjectResult;
        ok.Should().NotBeNull();
        ok!.StatusCode.Should().Be(200);
    }

    [Fact]
    public async Task Register_DuplicateEmail_Returns400()
    {
        var controller = CreateController();
        var request = new RegisterRequest { Email = "dup@test.com", Password = "pass", Role = Skillin.Domain.Enums.UserRole.Student };
        await controller.Register(request);

        var result = await controller.Register(request);

        var bad = result as BadRequestObjectResult;
        bad.Should().NotBeNull();
        bad!.StatusCode.Should().Be(400);
    }

    [Fact]
    public async Task Login_CorrectCredentials_Returns200WithData()
    {
        var controller = CreateController();
        var reg = new RegisterRequest { Email = "login@test.com", Password = "secret", Role = Skillin.Domain.Enums.UserRole.Student };
        await controller.Register(reg);

        var result = await controller.Login(new LoginRequest { Email = "login@test.com", Password = "secret" });

        var ok = result as OkObjectResult;
        ok.Should().NotBeNull();
        ok!.StatusCode.Should().Be(200);
    }

    [Fact]
    public async Task Login_WrongPassword_Returns401()
    {
        var controller = CreateController();
        var reg = new RegisterRequest { Email = "u@test.com", Password = "correct", Role = Skillin.Domain.Enums.UserRole.Student };
        await controller.Register(reg);

        var result = await controller.Login(new LoginRequest { Email = "u@test.com", Password = "wrong" });

        var unauth = result as UnauthorizedObjectResult;
        unauth.Should().NotBeNull();
        unauth!.StatusCode.Should().Be(401);
    }

    [Fact]
    public async Task Login_UnknownEmail_Returns401()
    {
        var controller = CreateController();

        var result = await controller.Login(new LoginRequest { Email = "ghost@test.com", Password = "any" });

        var unauth = result as UnauthorizedObjectResult;
        unauth.Should().NotBeNull();
        unauth!.StatusCode.Should().Be(401);
    }
}
