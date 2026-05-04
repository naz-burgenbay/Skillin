using FluentAssertions;
using Skillin.Domain.Entities;
using Skillin.Domain.Enums;
using Skillin.Application.DTOs;
using Skillin.Infrastructure.Data;
using Skillin.Services;
using Skillin.Tests.Helpers;

namespace Skillin.Tests.Services;

public class ListingServiceTests
{
    private static ListingService CreateSut(out AppDbContext context)
    {
        context = DbContextFactory.Create();
        return new ListingService(context);
    }

    private static async Task<(User user, CompanyProfile company)> SeedCompanyAsync(AppDbContext ctx, string email = "company@test.com")
    {
        var user = new User { Email = email, PasswordHash = "x", Role = UserRole.Company };
        var company = new CompanyProfile { UserId = user.Id, CompanyName = "Test Co" };
        ctx.Users.Add(user);
        ctx.CompanyProfiles.Add(company);
        await ctx.SaveChangesAsync();
        return (user, company);
    }

    private static async Task<InternshipListing> SeedListingAsync(
        AppDbContext ctx,
        Guid companyProfileId,
        string title = "Dev Intern",
        string location = "Remote",
        bool isActive = true)
    {
        var listing = new InternshipListing
        {
            CompanyProfileId = companyProfileId,
            Title = title,
            Location = location,
            IsActive = isActive
        };
        ctx.Listings.Add(listing);
        await ctx.SaveChangesAsync();
        return listing;
    }

    [Fact]
    public async Task GetAllAsync_OnlyReturnsActiveListings()
    {
        var sut = CreateSut(out var ctx);
        var (_, company) = await SeedCompanyAsync(ctx);
        await SeedListingAsync(ctx, company.Id, isActive: true);
        await SeedListingAsync(ctx, company.Id, title: "Inactive", isActive: false);

        var result = await sut.GetAllAsync();

        result.Should().HaveCount(1);
        result[0].IsActive.Should().BeTrue();
    }

    [Fact]
    public async Task GetAllAsync_NoListings_ReturnsEmptyList()
    {
        var sut = CreateSut(out _);

        var result = await sut.GetAllAsync();

        result.Should().BeEmpty();
    }

    [Fact]
    public async Task GetAllAsync_SearchByTitle_ReturnsMatchingListings()
    {
        var sut = CreateSut(out var ctx);
        var (_, company) = await SeedCompanyAsync(ctx);
        await SeedListingAsync(ctx, company.Id, title: "Backend Developer");
        await SeedListingAsync(ctx, company.Id, title: "Marketing Manager");

        var result = await sut.GetAllAsync(search: "Backend");

        result.Should().HaveCount(1);
        result[0].Title.Should().Be("Backend Developer");
    }

    [Fact]
    public async Task GetAllAsync_SearchByLocation_ReturnsMatchingListings()
    {
        var sut = CreateSut(out var ctx);
        var (_, company) = await SeedCompanyAsync(ctx);
        await SeedListingAsync(ctx, company.Id, title: "Role A", location: "Baku");
        await SeedListingAsync(ctx, company.Id, title: "Role B", location: "Istanbul");

        var result = await sut.GetAllAsync(search: "Baku");

        result.Should().HaveCount(1);
        result[0].Location.Should().Be("Baku");
    }

    [Fact]
    public async Task GetAllAsync_SearchNoMatch_ReturnsEmptyList()
    {
        var sut = CreateSut(out var ctx);
        var (_, company) = await SeedCompanyAsync(ctx);
        await SeedListingAsync(ctx, company.Id, title: "Dev Intern");

        var result = await sut.GetAllAsync(search: "XYZ_NOMATCH");

        result.Should().BeEmpty();
    }

    [Fact]
    public async Task GetByIdAsync_ExistingListing_ReturnsListing()
    {
        var sut = CreateSut(out var ctx);
        var (_, company) = await SeedCompanyAsync(ctx);
        var listing = await SeedListingAsync(ctx, company.Id);

        var result = await sut.GetByIdAsync(listing.Id);

        result.Should().NotBeNull();
        result!.Id.Should().Be(listing.Id);
    }

    [Fact]
    public async Task GetByIdAsync_NotFound_ReturnsNull()
    {
        var sut = CreateSut(out _);

        var result = await sut.GetByIdAsync(Guid.NewGuid());

        result.Should().BeNull();
    }

    [Fact]
    public async Task GetByCurrentUserAsync_NoCompanyProfile_ReturnsEmptyList()
    {
        var sut = CreateSut(out _);

        var result = await sut.GetByCurrentUserAsync(Guid.NewGuid());

        result.Should().BeEmpty();
    }

    [Fact]
    public async Task GetByCurrentUserAsync_ReturnsOnlyOwnListings()
    {
        var sut = CreateSut(out var ctx);
        var (companyUser, company) = await SeedCompanyAsync(ctx);
        var (_, otherCompany) = await SeedCompanyAsync(ctx, "other@test.com");
        await SeedListingAsync(ctx, company.Id, title: "Mine");
        await SeedListingAsync(ctx, otherCompany.Id, title: "Not Mine");

        var result = await sut.GetByCurrentUserAsync(companyUser.Id);

        result.Should().HaveCount(1);
        result[0].Title.Should().Be("Mine");
    }

    [Fact]
    public async Task CreateAsync_NoCompanyProfile_ReturnsFalse()
    {
        var sut = CreateSut(out _);
        var request = new CreateListingRequest { Title = "Intern", Description = "Desc" };

        var result = await sut.CreateAsync(Guid.NewGuid(), request);

        result.Success.Should().BeFalse();
        result.Data.Should().BeNull();
    }

    [Fact]
    public async Task CreateAsync_ValidRequest_ReturnsSuccessWithData()
    {
        var sut = CreateSut(out var ctx);
        var (companyUser, _) = await SeedCompanyAsync(ctx);
        var request = new CreateListingRequest { Title = "New Intern", Description = "Desc", Location = "Remote" };

        var result = await sut.CreateAsync(companyUser.Id, request);

        result.Success.Should().BeTrue();
        result.Data.Should().NotBeNull();
        result.Data!.Title.Should().Be("New Intern");
    }

    [Fact]
    public async Task CreateAsync_ValidRequest_PersistsListingToDatabase()
    {
        var sut = CreateSut(out var ctx);
        var (companyUser, _) = await SeedCompanyAsync(ctx);
        var request = new CreateListingRequest { Title = "New Intern", Description = "Desc" };

        await sut.CreateAsync(companyUser.Id, request);

        ctx.Listings.Should().HaveCount(1);
    }

    [Fact]
    public async Task UpdateAsync_ListingNotFound_ReturnsFalse()
    {
        var sut = CreateSut(out _);
        var request = new UpdateListingRequest { Title = "Updated", IsActive = true };

        var result = await sut.UpdateAsync(Guid.NewGuid(), Guid.NewGuid(), request);

        result.Success.Should().BeFalse();
    }

    [Fact]
    public async Task UpdateAsync_UserDoesNotOwnListing_ReturnsFalse()
    {
        var sut = CreateSut(out var ctx);
        var (_, company) = await SeedCompanyAsync(ctx);
        var listing = await SeedListingAsync(ctx, company.Id);
        var request = new UpdateListingRequest { Title = "Hacked", IsActive = true };

        var result = await sut.UpdateAsync(listing.Id, Guid.NewGuid(), request);

        result.Success.Should().BeFalse();
    }

    [Fact]
    public async Task UpdateAsync_Owner_UpdatesListingAndReturnsSuccess()
    {
        var sut = CreateSut(out var ctx);
        var (companyUser, company) = await SeedCompanyAsync(ctx);
        var listing = await SeedListingAsync(ctx, company.Id);
        var request = new UpdateListingRequest { Title = "Updated Title", Description = "New Desc", IsActive = true };

        var result = await sut.UpdateAsync(listing.Id, companyUser.Id, request);

        result.Success.Should().BeTrue();
        ctx.Listings.Single().Title.Should().Be("Updated Title");
    }

    [Fact]
    public async Task UpdateAsync_Owner_CanDeactivateListing()
    {
        var sut = CreateSut(out var ctx);
        var (companyUser, company) = await SeedCompanyAsync(ctx);
        var listing = await SeedListingAsync(ctx, company.Id, isActive: true);
        var request = new UpdateListingRequest { Title = listing.Title, IsActive = false };

        var result = await sut.UpdateAsync(listing.Id, companyUser.Id, request);

        result.Success.Should().BeTrue();
        ctx.Listings.Single().IsActive.Should().BeFalse();
    }

    [Fact]
    public async Task DeleteAsync_ListingNotFound_ReturnsFalse()
    {
        var sut = CreateSut(out _);

        var result = await sut.DeleteAsync(Guid.NewGuid(), Guid.NewGuid());

        result.Success.Should().BeFalse();
    }

    [Fact]
    public async Task DeleteAsync_UserDoesNotOwnListing_ReturnsFalse()
    {
        var sut = CreateSut(out var ctx);
        var (_, company) = await SeedCompanyAsync(ctx);
        var listing = await SeedListingAsync(ctx, company.Id);

        var result = await sut.DeleteAsync(listing.Id, Guid.NewGuid());

        result.Success.Should().BeFalse();
        ctx.Listings.Should().HaveCount(1);
    }

    [Fact]
    public async Task DeleteAsync_Owner_DeletesListingAndReturnsSuccess()
    {
        var sut = CreateSut(out var ctx);
        var (companyUser, company) = await SeedCompanyAsync(ctx);
        var listing = await SeedListingAsync(ctx, company.Id);

        var result = await sut.DeleteAsync(listing.Id, companyUser.Id);

        result.Success.Should().BeTrue();
        ctx.Listings.Should().BeEmpty();
    }
}
