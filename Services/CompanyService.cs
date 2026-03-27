using Skillin.Data;
using Skillin.DTOs;
using Skillin.Entities;
using Microsoft.EntityFrameworkCore;

namespace Skillin.Services;

public class CompanyService
{
    private readonly AppDbContext _context;

    public CompanyService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<CompanyProfileResponse>> GetAllAsync()
    {
        return await _context.CompanyProfiles
            .Include(c => c.User)
            .Select(c => MapToResponse(c))
            .ToListAsync();
    }

    public async Task<CompanyProfileResponse?> GetByIdAsync(Guid id)
    {
        var profile = await _context.CompanyProfiles
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.Id == id);

        return profile is null ? null : MapToResponse(profile);
    }

    public async Task<CompanyProfileResponse?> GetByUserIdAsync(Guid userId)
    {
        var profile = await _context.CompanyProfiles
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        return profile is null ? null : MapToResponse(profile);
    }

    public async Task<(bool Success, string Message, CompanyProfileResponse? Data)> CreateAsync(Guid userId, CreateCompanyProfileRequest request)
    {
        var exists = await _context.CompanyProfiles.AnyAsync(c => c.UserId == userId);
        if (exists)
            return (false, "Company profile already exists for this user.", null);

        var profile = new CompanyProfile
        {
            UserId = userId,
            CompanyName = request.CompanyName,
            Description = request.Description,
            Website = request.Website
        };

        _context.CompanyProfiles.Add(profile);
        await _context.SaveChangesAsync();

        var created = await _context.CompanyProfiles
            .Include(c => c.User)
            .FirstAsync(c => c.Id == profile.Id);

        return (true, "Company profile created.", MapToResponse(created));
    }

    public async Task<(bool Success, string Message, CompanyProfileResponse? Data)> UpdateAsync(Guid id, Guid userId, UpdateCompanyProfileRequest request)
    {
        var profile = await _context.CompanyProfiles
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (profile is null) return (false, "Profile not found.", null);
        if (profile.UserId != userId) return (false, "Access denied.", null);

        profile.CompanyName = request.CompanyName;
        profile.Description = request.Description;
        profile.Website = request.Website;

        await _context.SaveChangesAsync();
        return (true, "Profile updated.", MapToResponse(profile));
    }

    public async Task<(bool Success, string Message)> DeleteAsync(Guid id, Guid userId)
    {
        var profile = await _context.CompanyProfiles.FindAsync(id);
        if (profile is null) return (false, "Profile not found.");
        if (profile.UserId != userId) return (false, "Access denied.");

        _context.CompanyProfiles.Remove(profile);
        await _context.SaveChangesAsync();
        return (true, "Profile deleted.");
    }

    private static CompanyProfileResponse MapToResponse(CompanyProfile c) => new()
    {
        Id = c.Id,
        UserId = c.UserId,
        Email = c.User?.Email ?? "",
        CompanyName = c.CompanyName,
        Description = c.Description,
        Website = c.Website,
        CreatedAt = c.CreatedAt
    };
}