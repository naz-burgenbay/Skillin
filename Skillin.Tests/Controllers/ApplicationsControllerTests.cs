using FluentAssertions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Skillin.Controllers;
using Skillin.Infrastructure.Services;
using Skillin.Tests.Helpers;

namespace Skillin.Tests.Controllers;

public class ApplicationsControllerTests
{
    private static ApplicationsController CreateController()
    {
        var context = DbContextFactory.Create();
        var service = new ApplicationService(context);
        var mockEnv = new Mock<IWebHostEnvironment>();
        return new ApplicationsController(service, mockEnv.Object);
    }

    private static IFormFile MakeFakeFile(string fileName, long sizeBytes)
    {
        var mock = new Mock<IFormFile>();
        mock.Setup(f => f.FileName).Returns(fileName);
        mock.Setup(f => f.Length).Returns(sizeBytes);
        return mock.Object;
    }

    [Fact]
    public async Task Apply_InvalidCvExtension_Returns400BeforeServiceCall()
    {
        var controller = CreateController();
        var cv = MakeFakeFile("resume.exe", 500);

        var result = await controller.Apply(Guid.NewGuid(), "cover", cv);

        var bad = result as BadRequestObjectResult;
        bad.Should().NotBeNull();
        bad!.StatusCode.Should().Be(400);
    }

    [Theory]
    [InlineData("resume.txt")]
    [InlineData("resume.png")]
    [InlineData("resume.zip")]
    public async Task Apply_DisallowedExtensions_Returns400(string fileName)
    {
        var controller = CreateController();
        var cv = MakeFakeFile(fileName, 500);

        var result = await controller.Apply(Guid.NewGuid(), "cover", cv);

        var bad = result as BadRequestObjectResult;
        bad.Should().NotBeNull();
        bad!.StatusCode.Should().Be(400);
    }

    [Fact]
    public async Task Apply_CvExceedsSizeLimit_Returns400()
    {
        var controller = CreateController();
        var cv = MakeFakeFile("resume.pdf", 11 * 1024 * 1024);

        var result = await controller.Apply(Guid.NewGuid(), "cover", cv);

        var bad = result as BadRequestObjectResult;
        bad.Should().NotBeNull();
        bad!.StatusCode.Should().Be(400);
    }

    [Fact]
    public async Task Update_InvalidCvExtension_Returns400()
    {
        var controller = CreateController();
        var cv = MakeFakeFile("malware.bat", 500);

        var result = await controller.Update(Guid.NewGuid(), "updated cover", cv);

        var bad = result as BadRequestObjectResult;
        bad.Should().NotBeNull();
        bad!.StatusCode.Should().Be(400);
    }

    [Fact]
    public async Task Update_CvExceedsSizeLimit_Returns400()
    {
        var controller = CreateController();
        var cv = MakeFakeFile("resume.docx", 11 * 1024 * 1024);

        var result = await controller.Update(Guid.NewGuid(), "cover", cv);

        var bad = result as BadRequestObjectResult;
        bad.Should().NotBeNull();
        bad!.StatusCode.Should().Be(400);
    }
}
