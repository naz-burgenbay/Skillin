using Skillin.Domain.Entities;
using Skillin.Domain.Enums;
using Skillin.Application.DTOs;
using Skillin.Application.Interfaces;
using Skillin.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Skillin.Infrastructure.Services;

public class ApplicationService : IApplicationService
{
    private readonly AppDbContext _context;

    public ApplicationService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<ApplicationResponse>> GetByStudentAsync(Guid userId)
    {
        var student = await _context.StudentProfiles
            .FirstOrDefaultAsync(s => s.UserId == userId);

        if (student is null) return new List<ApplicationResponse>();

        return await _context.Applications
            .Include(a => a.Listing).ThenInclude(l => l.CompanyProfile)
            .Include(a => a.StudentProfile).ThenInclude(s => s.User)
            .Where(a => a.StudentProfileId == student.Id)
            .OrderByDescending(a => a.AppliedAt)
            .Select(a => MapToResponse(a))
            .ToListAsync();
    }

    public async Task<List<ApplicationResponse>> GetByListingAsync(Guid listingId, Guid userId)
    {
        var listing = await _context.Listings
            .Include(l => l.CompanyProfile)
            .FirstOrDefaultAsync(l => l.Id == listingId);

        if (listing is null || listing.CompanyProfile.UserId != userId)
            return new List<ApplicationResponse>();

        return await _context.Applications
            .Include(a => a.Listing).ThenInclude(l => l.CompanyProfile)
            .Include(a => a.StudentProfile).ThenInclude(s => s.User)
            .Where(a => a.ListingId == listingId)
            .OrderByDescending(a => a.AppliedAt)
            .Select(a => MapToResponse(a))
            .ToListAsync();
    }

    public async Task<List<ApplicationResponse>> GetByCompanyAsync(Guid userId)
    {
        var company = await _context.CompanyProfiles
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (company is null) return new List<ApplicationResponse>();

        var listingIds = await _context.Listings
            .Where(l => l.CompanyProfileId == company.Id)
            .Select(l => l.Id)
            .ToListAsync();

        return await _context.Applications
            .Include(a => a.Listing).ThenInclude(l => l.CompanyProfile)
            .Include(a => a.StudentProfile).ThenInclude(s => s.User)
            .Where(a => listingIds.Contains(a.ListingId))
            .OrderByDescending(a => a.AppliedAt)
            .Select(a => MapToResponse(a))
            .ToListAsync();
    }

    public async Task<(bool Success, string Message, ApplicationResponse? Data)> ApplyAsync(Guid userId, CreateApplicationRequest request, string? cvPath = null)
    {
        var student = await _context.StudentProfiles
            .FirstOrDefaultAsync(s => s.UserId == userId);

        if (student is null)
            return (false, "Create a student profile first.", null);

        var listing = await _context.Listings.FindAsync(request.ListingId);
        if (listing is null)
            return (false, "Listing not found.", null);

        if (!listing.IsActive)
            return (false, "This listing is no longer active.", null);

        var alreadyApplied = await _context.Applications
            .AnyAsync(a => a.ListingId == request.ListingId && a.StudentProfileId == student.Id);

        if (alreadyApplied)
            return (false, "You have already applied to this listing.", null);

        var application = new JobApplication
        {
            ListingId = request.ListingId,
            StudentProfileId = student.Id,
            CoverLetter = request.CoverLetter,
            CvPath = cvPath ?? string.Empty
        };

        _context.Applications.Add(application);
        await _context.SaveChangesAsync();

        var created = await _context.Applications
            .Include(a => a.Listing).ThenInclude(l => l.CompanyProfile)
            .Include(a => a.StudentProfile).ThenInclude(s => s.User)
            .FirstAsync(a => a.Id == application.Id);

        return (true, "Application submitted.", MapToResponse(created));
    }

    public async Task<(bool Success, string Message, ApplicationResponse? Data)> UpdateStatusAsync(Guid id, Guid userId, UpdateApplicationStatusRequest request)
    {
        var application = await _context.Applications
            .Include(a => a.Listing).ThenInclude(l => l.CompanyProfile)
            .Include(a => a.StudentProfile).ThenInclude(s => s.User)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (application is null) return (false, "Application not found.", null);
        if (application.Listing.CompanyProfile.UserId != userId)
            return (false, "Access denied.", null);

        application.Status = request.Status;
        await _context.SaveChangesAsync();

        return (true, "Status updated.", MapToResponse(application));
    }

    public async Task<(bool Success, string Message, ApplicationResponse? Data)> UpdateAsync(Guid id, Guid userId, UpdateApplicationRequest request, string? cvPath = null)
    {
        var student = await _context.StudentProfiles
            .FirstOrDefaultAsync(s => s.UserId == userId);

        if (student is null) return (false, "Student profile not found.", null);

        var application = await _context.Applications
            .Include(a => a.Listing).ThenInclude(l => l.CompanyProfile)
            .Include(a => a.StudentProfile).ThenInclude(s => s.User)
            .FirstOrDefaultAsync(a => a.Id == id && a.StudentProfileId == student.Id);

        if (application is null) return (false, "Application not found.", null);

        application.CoverLetter = request.CoverLetter;
        if (cvPath != null) application.CvPath = cvPath;

        await _context.SaveChangesAsync();
        return (true, "Application updated.", MapToResponse(application));
    }

    public async Task<(bool Success, string Message)> WithdrawAsync(Guid id, Guid userId)
    {
        var student = await _context.StudentProfiles
            .FirstOrDefaultAsync(s => s.UserId == userId);

        if (student is null) return (false, "Student profile not found.");

        var application = await _context.Applications.FindAsync(id);
        if (application is null) return (false, "Application not found.");
        if (application.StudentProfileId != student.Id) return (false, "Access denied.");

        _context.Applications.Remove(application);
        await _context.SaveChangesAsync();
        return (true, "Application withdrawn.");
    }

    private static ApplicationResponse MapToResponse(JobApplication a) => new()
    {
        Id = a.Id,
        ListingId = a.ListingId,
        ListingTitle = a.Listing?.Title ?? "",
        CompanyName = a.Listing?.CompanyProfile?.CompanyName ?? "",
        StudentProfileId = a.StudentProfileId,
        StudentName = a.StudentProfile?.FullName ?? "",
        StudentEmail = a.StudentProfile?.User?.Email ?? "",
        CoverLetter = a.CoverLetter,
        CvUrl = string.IsNullOrEmpty(a.CvPath) ? string.Empty : "/" + a.CvPath.Replace("\\", "/"),
        Status = a.Status.ToString(),
        AppliedAt = a.AppliedAt
    };
}