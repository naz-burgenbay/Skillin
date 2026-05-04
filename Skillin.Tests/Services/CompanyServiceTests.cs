using FluentAssertions;
using Skillin.Domain.Entities;
using Skillin.Domain.Enums;
using Skillin.Application.DTOs;
using Skillin.Infrastructure.Data;
using Skillin.Services;
using Skillin.Tests.Helpers;

namespace Skillin.Tests.Services;

public class CompanyServiceTests
{
    private static CompanyService CreateSut(out AppDbContext context)
    {
        context = DbContextFactory.Create();
        return new CompanyService(context);
    }

    private static async Task<(User user, CompanyProfile profile)> SeedCompanyAsync(AppDbContext ctx, string email = "company@test.com")
    {
        var user = new User { Email = email, PasswordHash = "x", Role = UserRole.Company };
        var profile = new CompanyProfile { UserId = user.Id, CompanyName = "Acme" };
        ctx.Users.Add(user);
        ctx.CompanyProfiles.Add(profile);
        await ctx.SaveChangesAsync();
        return (user, profile);
    }

    [Fact]
    public async Task GetAllAsync_NoProfiles_ReturnsEmptyList()
    {
        var sut = CreateSut(out _);

        var result = await sut.GetAllAsync();

        result.Should().BeEmpty();
    }

    [Fact]
    public async Task GetAllAsync_WithProfiles_ReturnsAll()
    {
        var sut = CreateSut(out var ctx);
        await SeedCompanyAsync(ctx, "a@test.com");
        await SeedCompanyAsync(ctx, "b@test.com");

        var result = await sut.GetAllAsync();

        result.Should().HaveCount(2);
    }

    [Fact]
    public async Task GetByIdAsync_ExistingProfile_ReturnsProfile()
    {
        var sut = CreateSut(out var ctx);
        var (_, profile) = await SeedCompanyAsync(ctx);

        var result = await sut.GetByIdAsync(profile.Id);

        result.Should().NotBeNull();
        result!.Id.Should().Be(profile.Id);
    }

    [Fact]
    public async Task GetByIdAsync_NotFound_ReturnsNull()
    {
        var sut = CreateSut(out _);

        var result = await sut.GetByIdAsync(Guid.NewGuid());

        result.Should().BeNull();
    }

    [Fact]
    public async Task GetByUserIdAsync_ExistingProfile_ReturnsProfile()
    {
        var sut = CreateSut(out var ctx);
        var (user, _) = await SeedCompanyAsync(ctx);

        var result = await sut.GetByUserIdAsync(user.Id);

        result.Should().NotBeNull();
        result!.UserId.Should().Be(user.Id);
    }

    [Fact]
    public async Task GetByUserIdAsync_NotFound_ReturnsNull()
    {
        var sut = CreateSut(out _);

        var result = await sut.GetByUserIdAsync(Guid.NewGuid());

        result.Should().BeNull();
    }

    [Fact]
    public async Task CreateAsync_NewProfile_ReturnsSuccess()
    {
        var sut = CreateSut(out var ctx);
        var user = new User { Email = "new@test.com", PasswordHash = "x", Role = UserRole.Company };
        ctx.Users.Add(user);
        await ctx.SaveChangesAsync();
        var request = new CreateCompanyProfileRequest { CompanyName = "NewCo", Description = "Desc", Website = "https://newco.com" };

        var result = await sut.CreateAsync(user.Id, request);

        result.Success.Should().BeTrue();
        result.Data.Should().NotBeNull();
        result.Data!.CompanyName.Should().Be("NewCo");
    }

    [Fact]
    public async Task CreateAsync_DuplicateProfile_ReturnsFalse()
    {
        var sut = CreateSut(out var ctx);
        var (user, _) = await SeedCompanyAsync(ctx);
        var request = new CreateCompanyProfileRequest { CompanyName = "Another" };

        var result = await sut.CreateAsync(user.Id, request);

        result.Success.Should().BeFalse();
        result.Data.Should().BeNull();
    }

    [Fact]
    public async Task UpdateAsync_Owner_UpdatesProfileAndReturnsSuccess()
    {
        var sut = CreateSut(out var ctx);
        var (user, profile) = await SeedCompanyAsync(ctx);
        var request = new UpdateCompanyProfileRequest { CompanyName = "UpdatedCo", Description = "New", Website = "https://updated.com" };

        var result = await sut.UpdateAsync(profile.Id, user.Id, request);

        result.Success.Should().BeTrue();
        ctx.CompanyProfiles.Single().CompanyName.Should().Be("UpdatedCo");
    }

    [Fact]
    public async Task UpdateAsync_NonOwner_ReturnsFalseAccessDenied()
    {
        var sut = CreateSut(out var ctx);
        var (_, profile) = await SeedCompanyAsync(ctx);
        var request = new UpdateCompanyProfileRequest { CompanyName = "Hacked" };

        var result = await sut.UpdateAsync(profile.Id, Guid.NewGuid(), request);

        result.Success.Should().BeFalse();
        result.Message.Should().Contain("denied");
    }

    [Fact]
    public async Task UpdateAsync_ProfileNotFound_ReturnsFalse()
    {
        var sut = CreateSut(out _);
        var request = new UpdateCompanyProfileRequest { CompanyName = "X" };

        var result = await sut.UpdateAsync(Guid.NewGuid(), Guid.NewGuid(), request);

        result.Success.Should().BeFalse();
    }

    [Fact]
    public async Task UpdateByUserIdAsync_ProfileNotFound_ReturnsFalse()
    {
        var sut = CreateSut(out _);
        var request = new UpdateCompanyProfileRequest { CompanyName = "X" };

        var result = await sut.UpdateByUserIdAsync(Guid.NewGuid(), request);

        result.Success.Should().BeFalse();
    }

    [Fact]
    public async Task UpdateByUserIdAsync_ExistingProfile_UpdatesAndReturnsSuccess()
    {
        var sut = CreateSut(out var ctx);
        var (user, _) = await SeedCompanyAsync(ctx);
        var request = new UpdateCompanyProfileRequest { CompanyName = "UpdatedViaUserId", Description = "d", Website = "w" };

        var result = await sut.UpdateByUserIdAsync(user.Id, request);

        result.Success.Should().BeTrue();
        ctx.CompanyProfiles.Single().CompanyName.Should().Be("UpdatedViaUserId");
    }

    [Fact]
    public async Task DeleteAsync_Owner_DeletesAndReturnsSuccess()
    {
        var sut = CreateSut(out var ctx);
        var (user, profile) = await SeedCompanyAsync(ctx);

        var result = await sut.DeleteAsync(profile.Id, user.Id);

        result.Success.Should().BeTrue();
        ctx.CompanyProfiles.Should().BeEmpty();
    }

    [Fact]
    public async Task DeleteAsync_NonOwner_ReturnsFalseAccessDenied()
    {
        var sut = CreateSut(out var ctx);
        var (_, profile) = await SeedCompanyAsync(ctx);

        var result = await sut.DeleteAsync(profile.Id, Guid.NewGuid());

        result.Success.Should().BeFalse();
        ctx.CompanyProfiles.Should().HaveCount(1);
    }

    [Fact]
    public async Task DeleteAsync_ProfileNotFound_ReturnsFalse()
    {
        var sut = CreateSut(out _);

        var result = await sut.DeleteAsync(Guid.NewGuid(), Guid.NewGuid());

        result.Success.Should().BeFalse();
    }
}
