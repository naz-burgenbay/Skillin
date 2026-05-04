using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Skillin.Controllers;
using Skillin.Services;
using Skillin.Tests.Helpers;

namespace Skillin.Tests.Controllers;

public class ListingsControllerTests
{
    private static ListingsController CreateController(out Skillin.Infrastructure.Data.AppDbContext context)
    {
        context = DbContextFactory.Create();
        var service = new ListingService(context);
        return new ListingsController(service);
    }

    [Fact]
    public async Task GetById_ListingDoesNotExist_Returns404()
    {
        var controller = CreateController(out _);

        var result = await controller.GetById(Guid.NewGuid());

        var notFound = result as NotFoundObjectResult;
        notFound.Should().NotBeNull();
        notFound!.StatusCode.Should().Be(404);
    }

    [Fact]
    public async Task GetById_ListingExists_Returns200()
    {
        var controller = CreateController(out var ctx);
        var user = new Skillin.Domain.Entities.User { Email = "co@test.com", PasswordHash = "x", Role = Skillin.Domain.Enums.UserRole.Company };
        var company = new Skillin.Domain.Entities.CompanyProfile { UserId = user.Id, CompanyName = "Co" };
        var listing = new Skillin.Domain.Entities.InternshipListing { CompanyProfileId = company.Id, Title = "Dev Intern", IsActive = true };
        ctx.Users.Add(user);
        ctx.CompanyProfiles.Add(company);
        ctx.Listings.Add(listing);
        await ctx.SaveChangesAsync();

        var result = await controller.GetById(listing.Id);

        var ok = result as OkObjectResult;
        ok.Should().NotBeNull();
        ok!.StatusCode.Should().Be(200);
    }

    [Fact]
    public async Task GetAll_NoListings_Returns200WithEmptyList()
    {
        var controller = CreateController(out _);

        var result = await controller.GetAll();

        var ok = result as OkObjectResult;
        ok.Should().NotBeNull();
        ok!.StatusCode.Should().Be(200);
    }
}
