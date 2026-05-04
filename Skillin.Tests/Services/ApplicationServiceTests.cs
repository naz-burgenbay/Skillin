using FluentAssertions;
using Skillin.Domain.Entities;
using Skillin.Domain.Enums;
using Skillin.Application.DTOs;
using Skillin.Infrastructure.Data;
using Skillin.Infrastructure.Services;
using Skillin.Tests.Helpers;

namespace Skillin.Tests.Services;

public class ApplicationServiceTests
{
    private static ApplicationService CreateSut(out AppDbContext context)
    {
        context = DbContextFactory.Create();
        return new ApplicationService(context);
    }

    private static async Task<(User user, StudentProfile profile)> SeedStudentAsync(AppDbContext ctx, string email = "student@test.com")
    {
        var user = new User { Email = email, PasswordHash = "x", Role = UserRole.Student };
        var profile = new StudentProfile { UserId = user.Id, FullName = "Test Student" };
        ctx.Users.Add(user);
        ctx.StudentProfiles.Add(profile);
        await ctx.SaveChangesAsync();
        return (user, profile);
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

    private static async Task<InternshipListing> SeedListingAsync(AppDbContext ctx, Guid companyProfileId, bool isActive = true)
    {
        var listing = new InternshipListing
        {
            CompanyProfileId = companyProfileId,
            Title = "Dev Intern",
            Location = "Remote",
            IsActive = isActive
        };
        ctx.Listings.Add(listing);
        await ctx.SaveChangesAsync();
        return listing;
    }

    private static async Task<JobApplication> SeedApplicationAsync(AppDbContext ctx, Guid listingId, Guid studentProfileId)
    {
        var app = new JobApplication
        {
            ListingId = listingId,
            StudentProfileId = studentProfileId,
            CoverLetter = "Hello"
        };
        ctx.Applications.Add(app);
        await ctx.SaveChangesAsync();
        return app;
    }

    [Fact]
    public async Task GetByStudentAsync_NoStudentProfile_ReturnsEmptyList()
    {
        var sut = CreateSut(out _);

        var result = await sut.GetByStudentAsync(Guid.NewGuid());

        result.Should().BeEmpty();
    }

    [Fact]
    public async Task GetByStudentAsync_StudentHasApplications_ReturnsOnlyTheirApplications()
    {
        var sut = CreateSut(out var ctx);
        var (_, student) = await SeedStudentAsync(ctx);
        var (_, company) = await SeedCompanyAsync(ctx);
        var listing = await SeedListingAsync(ctx, company.Id);
        await SeedApplicationAsync(ctx, listing.Id, student.Id);

        var result = await sut.GetByStudentAsync(student.UserId);

        result.Should().HaveCount(1);
        result[0].StudentProfileId.Should().Be(student.Id);
    }

    [Fact]
    public async Task GetByCompanyAsync_NoCompanyProfile_ReturnsEmptyList()
    {
        var sut = CreateSut(out _);

        var result = await sut.GetByCompanyAsync(Guid.NewGuid());

        result.Should().BeEmpty();
    }

    [Fact]
    public async Task GetByCompanyAsync_ReturnsOnlyOwnCompanyApplications()
    {
        var sut = CreateSut(out var ctx);
        var (_, student) = await SeedStudentAsync(ctx);
        var (companyUser, company) = await SeedCompanyAsync(ctx);
        var (_, otherCompany) = await SeedCompanyAsync(ctx, "other@test.com");
        var myListing = await SeedListingAsync(ctx, company.Id);
        var otherListing = await SeedListingAsync(ctx, otherCompany.Id);
        await SeedApplicationAsync(ctx, myListing.Id, student.Id);
        await SeedApplicationAsync(ctx, otherListing.Id, student.Id);

        var result = await sut.GetByCompanyAsync(companyUser.Id);

        result.Should().HaveCount(1);
        result[0].ListingId.Should().Be(myListing.Id);
    }

    [Fact]
    public async Task GetByListingAsync_ListingNotFound_ReturnsEmptyList()
    {
        var sut = CreateSut(out _);

        var result = await sut.GetByListingAsync(Guid.NewGuid(), Guid.NewGuid());

        result.Should().BeEmpty();
    }

    [Fact]
    public async Task GetByListingAsync_UserDoesNotOwnListing_ReturnsEmptyList()
    {
        var sut = CreateSut(out var ctx);
        var (_, company) = await SeedCompanyAsync(ctx);
        var listing = await SeedListingAsync(ctx, company.Id);

        var result = await sut.GetByListingAsync(listing.Id, Guid.NewGuid());

        result.Should().BeEmpty();
    }

    [Fact]
    public async Task GetByListingAsync_OwnerRequests_ReturnsApplications()
    {
        var sut = CreateSut(out var ctx);
        var (_, student) = await SeedStudentAsync(ctx);
        var (companyUser, company) = await SeedCompanyAsync(ctx);
        var listing = await SeedListingAsync(ctx, company.Id);
        await SeedApplicationAsync(ctx, listing.Id, student.Id);

        var result = await sut.GetByListingAsync(listing.Id, companyUser.Id);

        result.Should().HaveCount(1);
    }

    [Fact]
    public async Task ApplyAsync_NoStudentProfile_ReturnsFalse()
    {
        var sut = CreateSut(out var ctx);
        var (_, company) = await SeedCompanyAsync(ctx);
        var listing = await SeedListingAsync(ctx, company.Id);
        var request = new CreateApplicationRequest { ListingId = listing.Id, CoverLetter = "Hi" };

        var result = await sut.ApplyAsync(Guid.NewGuid(), request);

        result.Success.Should().BeFalse();
    }

    [Fact]
    public async Task ApplyAsync_ListingNotFound_ReturnsFalse()
    {
        var sut = CreateSut(out var ctx);
        var (studentUser, _) = await SeedStudentAsync(ctx);
        var request = new CreateApplicationRequest { ListingId = Guid.NewGuid(), CoverLetter = "Hi" };

        var result = await sut.ApplyAsync(studentUser.Id, request);

        result.Success.Should().BeFalse();
    }

    [Fact]
    public async Task ApplyAsync_InactiveListing_ReturnsFalse()
    {
        var sut = CreateSut(out var ctx);
        var (studentUser, _) = await SeedStudentAsync(ctx);
        var (_, company) = await SeedCompanyAsync(ctx);
        var listing = await SeedListingAsync(ctx, company.Id, isActive: false);
        var request = new CreateApplicationRequest { ListingId = listing.Id, CoverLetter = "Hi" };

        var result = await sut.ApplyAsync(studentUser.Id, request);

        result.Success.Should().BeFalse();
    }

    [Fact]
    public async Task ApplyAsync_DuplicateApplication_ReturnsFalse()
    {
        var sut = CreateSut(out var ctx);
        var (studentUser, student) = await SeedStudentAsync(ctx);
        var (_, company) = await SeedCompanyAsync(ctx);
        var listing = await SeedListingAsync(ctx, company.Id);
        await SeedApplicationAsync(ctx, listing.Id, student.Id);
        var request = new CreateApplicationRequest { ListingId = listing.Id, CoverLetter = "Hi" };

        var result = await sut.ApplyAsync(studentUser.Id, request);

        result.Success.Should().BeFalse();
    }

    [Fact]
    public async Task ApplyAsync_ValidRequest_ReturnsSuccessWithData()
    {
        var sut = CreateSut(out var ctx);
        var (studentUser, _) = await SeedStudentAsync(ctx);
        var (_, company) = await SeedCompanyAsync(ctx);
        var listing = await SeedListingAsync(ctx, company.Id);
        var request = new CreateApplicationRequest { ListingId = listing.Id, CoverLetter = "Cover" };

        var result = await sut.ApplyAsync(studentUser.Id, request);

        result.Success.Should().BeTrue();
        result.Data.Should().NotBeNull();
        result.Data!.CoverLetter.Should().Be("Cover");
    }

    [Fact]
    public async Task ApplyAsync_ValidRequest_PersistsApplicationToDatabase()
    {
        var sut = CreateSut(out var ctx);
        var (studentUser, _) = await SeedStudentAsync(ctx);
        var (_, company) = await SeedCompanyAsync(ctx);
        var listing = await SeedListingAsync(ctx, company.Id);
        var request = new CreateApplicationRequest { ListingId = listing.Id, CoverLetter = "Cover" };

        await sut.ApplyAsync(studentUser.Id, request);

        ctx.Applications.Should().HaveCount(1);
    }

    [Fact]
    public async Task UpdateStatusAsync_ApplicationNotFound_ReturnsFalse()
    {
        var sut = CreateSut(out _);
        var request = new UpdateApplicationStatusRequest { Status = ApplicationStatus.Accepted };

        var result = await sut.UpdateStatusAsync(Guid.NewGuid(), Guid.NewGuid(), request);

        result.Success.Should().BeFalse();
    }

    [Fact]
    public async Task UpdateStatusAsync_UserDoesNotOwnListing_ReturnsFalse()
    {
        var sut = CreateSut(out var ctx);
        var (_, student) = await SeedStudentAsync(ctx);
        var (_, company) = await SeedCompanyAsync(ctx);
        var listing = await SeedListingAsync(ctx, company.Id);
        var app = await SeedApplicationAsync(ctx, listing.Id, student.Id);
        var request = new UpdateApplicationStatusRequest { Status = ApplicationStatus.Accepted };

        var result = await sut.UpdateStatusAsync(app.Id, Guid.NewGuid(), request);

        result.Success.Should().BeFalse();
    }

    [Fact]
    public async Task UpdateStatusAsync_Owner_UpdatesStatusAndReturnsSuccess()
    {
        var sut = CreateSut(out var ctx);
        var (_, student) = await SeedStudentAsync(ctx);
        var (companyUser, company) = await SeedCompanyAsync(ctx);
        var listing = await SeedListingAsync(ctx, company.Id);
        var app = await SeedApplicationAsync(ctx, listing.Id, student.Id);
        var request = new UpdateApplicationStatusRequest { Status = ApplicationStatus.Accepted };

        var result = await sut.UpdateStatusAsync(app.Id, companyUser.Id, request);

        result.Success.Should().BeTrue();
        ctx.Applications.Single().Status.Should().Be(ApplicationStatus.Accepted);
    }

    [Fact]
    public async Task UpdateAsync_NoStudentProfile_ReturnsFalse()
    {
        var sut = CreateSut(out _);
        var request = new UpdateApplicationRequest { CoverLetter = "New" };

        var result = await sut.UpdateAsync(Guid.NewGuid(), Guid.NewGuid(), request);

        result.Success.Should().BeFalse();
    }

    [Fact]
    public async Task UpdateAsync_ApplicationBelongsToOtherStudent_ReturnsFalse()
    {
        var sut = CreateSut(out var ctx);
        var (_, ownerStudent) = await SeedStudentAsync(ctx, "owner@test.com");
        var (otherUser, _) = await SeedStudentAsync(ctx, "other@test.com");
        var (_, company) = await SeedCompanyAsync(ctx);
        var listing = await SeedListingAsync(ctx, company.Id);
        var app = await SeedApplicationAsync(ctx, listing.Id, ownerStudent.Id);
        var request = new UpdateApplicationRequest { CoverLetter = "Hacked" };

        var result = await sut.UpdateAsync(app.Id, otherUser.Id, request);

        result.Success.Should().BeFalse();
    }

    [Fact]
    public async Task UpdateAsync_Owner_UpdatesCoverLetterAndReturnsSuccess()
    {
        var sut = CreateSut(out var ctx);
        var (studentUser, student) = await SeedStudentAsync(ctx);
        var (_, company) = await SeedCompanyAsync(ctx);
        var listing = await SeedListingAsync(ctx, company.Id);
        var app = await SeedApplicationAsync(ctx, listing.Id, student.Id);
        var request = new UpdateApplicationRequest { CoverLetter = "Updated letter" };

        var result = await sut.UpdateAsync(app.Id, studentUser.Id, request);

        result.Success.Should().BeTrue();
        ctx.Applications.Single().CoverLetter.Should().Be("Updated letter");
    }

    [Fact]
    public async Task WithdrawAsync_NoStudentProfile_ReturnsFalse()
    {
        var sut = CreateSut(out _);

        var result = await sut.WithdrawAsync(Guid.NewGuid(), Guid.NewGuid());

        result.Success.Should().BeFalse();
    }

    [Fact]
    public async Task WithdrawAsync_ApplicationNotFound_ReturnsFalse()
    {
        var sut = CreateSut(out var ctx);
        var (studentUser, _) = await SeedStudentAsync(ctx);

        var result = await sut.WithdrawAsync(Guid.NewGuid(), studentUser.Id);

        result.Success.Should().BeFalse();
    }

    [Fact]
    public async Task WithdrawAsync_ApplicationBelongsToOtherStudent_ReturnsFalse()
    {
        var sut = CreateSut(out var ctx);
        var (_, ownerStudent) = await SeedStudentAsync(ctx, "owner@test.com");
        var (otherUser, _) = await SeedStudentAsync(ctx, "other@test.com");
        var (_, company) = await SeedCompanyAsync(ctx);
        var listing = await SeedListingAsync(ctx, company.Id);
        var app = await SeedApplicationAsync(ctx, listing.Id, ownerStudent.Id);

        var result = await sut.WithdrawAsync(app.Id, otherUser.Id);

        result.Success.Should().BeFalse();
        ctx.Applications.Should().HaveCount(1);
    }

    [Fact]
    public async Task WithdrawAsync_Owner_DeletesApplicationAndReturnsSuccess()
    {
        var sut = CreateSut(out var ctx);
        var (studentUser, student) = await SeedStudentAsync(ctx);
        var (_, company) = await SeedCompanyAsync(ctx);
        var listing = await SeedListingAsync(ctx, company.Id);
        var app = await SeedApplicationAsync(ctx, listing.Id, student.Id);

        var result = await sut.WithdrawAsync(app.Id, studentUser.Id);

        result.Success.Should().BeTrue();
        ctx.Applications.Should().BeEmpty();
    }
}
