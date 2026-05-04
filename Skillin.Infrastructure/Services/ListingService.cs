using Skillin.Domain.Entities;
using Skillin.Application.DTOs;
using Skillin.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Skillin.Services;

public class ListingService
{
    private readonly AppDbContext _context;

    public ListingService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<ListingResponse>> GetAllAsync(string? search = null)
    {
        var query = _context.Listings
            .Include(l => l.CompanyProfile)
            .Include(l => l.Applications)
            .Where(l => l.IsActive)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(l => l.Title.Contains(search) || l.Location.Contains(search));

        return await query
            .OrderByDescending(l => l.CreatedAt)
            .Select(l => MapToResponse(l))
            .ToListAsync();
    }

    public async Task<ListingResponse?> GetByIdAsync(Guid id)
    {
        var listing = await _context.Listings
            .Include(l => l.CompanyProfile)
            .Include(l => l.Applications)
            .FirstOrDefaultAsync(l => l.Id == id);

        return listing is null ? null : MapToResponse(listing);
    }

    public async Task<List<ListingResponse>> GetByCompanyAsync(Guid companyProfileId)
    {
        return await _context.Listings
            .Include(l => l.CompanyProfile)
            .Include(l => l.Applications)
            .Where(l => l.CompanyProfileId == companyProfileId)
            .OrderByDescending(l => l.CreatedAt)
            .Select(l => MapToResponse(l))
            .ToListAsync();
    }

    public async Task<List<ListingResponse>> GetByCurrentUserAsync(Guid userId)
    {
        var company = await _context.CompanyProfiles
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (company is null) return new List<ListingResponse>();

        return await _context.Listings
            .Include(l => l.CompanyProfile)
            .Include(l => l.Applications)
            .Where(l => l.CompanyProfileId == company.Id)
            .OrderByDescending(l => l.CreatedAt)
            .Select(l => MapToResponse(l))
            .ToListAsync();
    }

    public async Task<(bool Success, string Message, ListingResponse? Data)> CreateAsync(Guid userId, CreateListingRequest request)
    {
        var company = await _context.CompanyProfiles
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (company is null)
            return (false, "Create a company profile first.", null);

        var listing = new InternshipListing
        {
            CompanyProfileId = company.Id,
            Title = request.Title,
            Description = request.Description,
            Requirements = request.Requirements,
            Location = request.Location,
            Type = request.Type,
            Duration = request.Duration
        };

        _context.Listings.Add(listing);
        await _context.SaveChangesAsync();

        var created = await _context.Listings
            .Include(l => l.CompanyProfile)
            .Include(l => l.Applications)
            .FirstAsync(l => l.Id == listing.Id);

        return (true, "Listing created.", MapToResponse(created));
    }

    public async Task<(bool Success, string Message, ListingResponse? Data)> UpdateAsync(Guid id, Guid userId, UpdateListingRequest request)
    {
        var listing = await _context.Listings
            .Include(l => l.CompanyProfile)
            .Include(l => l.Applications)
            .FirstOrDefaultAsync(l => l.Id == id);

        if (listing is null) return (false, "Listing not found.", null);
        if (listing.CompanyProfile.UserId != userId) return (false, "Access denied.", null);

        listing.Title = request.Title;
        listing.Description = request.Description;
        listing.Requirements = request.Requirements;
        listing.Location = request.Location;
        listing.Type = request.Type;
        listing.Duration = request.Duration;
        listing.IsActive = request.IsActive;

        await _context.SaveChangesAsync();
        return (true, "Listing updated.", MapToResponse(listing));
    }

    public async Task<(bool Success, string Message)> DeleteAsync(Guid id, Guid userId)
    {
        var listing = await _context.Listings
            .Include(l => l.CompanyProfile)
            .FirstOrDefaultAsync(l => l.Id == id);

        if (listing is null) return (false, "Listing not found.");
        if (listing.CompanyProfile.UserId != userId) return (false, "Access denied.");

        _context.Listings.Remove(listing);
        await _context.SaveChangesAsync();
        return (true, "Listing deleted.");
    }

    private static ListingResponse MapToResponse(InternshipListing l) => new()
    {
        Id = l.Id,
        CompanyProfileId = l.CompanyProfileId,
        CompanyName = l.CompanyProfile?.CompanyName ?? "",
        Title = l.Title,
        Description = l.Description,
        Requirements = l.Requirements,
        Location = l.Location,
        Type = l.Type,
        Duration = l.Duration,
        IsActive = l.IsActive,
        CreatedAt = l.CreatedAt,
        ApplicationCount = l.Applications?.Count ?? 0
    };
}