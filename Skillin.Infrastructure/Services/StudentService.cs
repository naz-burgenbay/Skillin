using Skillin.Domain.Entities;
using Skillin.Application.DTOs;
using Skillin.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Skillin.Infrastructure.Services;

public class StudentService
{
    private readonly AppDbContext _context;

    public StudentService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<StudentProfileResponse>> GetAllAsync()
    {
        return await _context.StudentProfiles
            .Include(s => s.User)
            .Select(s => MapToResponse(s))
            .ToListAsync();
    }

    public async Task<StudentProfileResponse?> GetByIdAsync(Guid id)
    {
        var profile = await _context.StudentProfiles
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.Id == id);
        return profile is null ? null : MapToResponse(profile);
    }

    public async Task<StudentProfileResponse?> GetByUserIdAsync(Guid userId)
    {
        var profile = await _context.StudentProfiles
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.UserId == userId);
        return profile is null ? null : MapToResponse(profile);
    }

    public async Task<(bool Success, string Message, StudentProfileResponse? Data)> CreateAsync(Guid userId, CreateStudentProfileRequest request)
    {
        var exists = await _context.StudentProfiles.AnyAsync(s => s.UserId == userId);
        if (exists)
            return (false, "Profile already exists for this user.", null);

        var profile = new StudentProfile
        {
            UserId = userId,
            FullName = request.FullName,
            Bio = request.Bio,
            Skills = request.Skills,
            UniversityName = request.UniversityName
        };

        _context.StudentProfiles.Add(profile);
        await _context.SaveChangesAsync();

        var created = await _context.StudentProfiles
            .Include(s => s.User)
            .FirstAsync(s => s.Id == profile.Id);

        return (true, "Profile created.", MapToResponse(created));
    }

    public async Task<(bool Success, string Message, StudentProfileResponse? Data)> UpdateAsync(Guid id, Guid userId, UpdateStudentProfileRequest request)
    {
        var profile = await _context.StudentProfiles
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (profile is null) return (false, "Profile not found.", null);
        if (profile.UserId != userId) return (false, "Access denied.", null);

        profile.FullName = request.FullName;
        profile.Bio = request.Bio;
        profile.Skills = request.Skills;
        profile.UniversityName = request.UniversityName;

        await _context.SaveChangesAsync();
        return (true, "Profile updated.", MapToResponse(profile));
    }

    public async Task<(bool Success, string Message)> DeleteAsync(Guid id, Guid userId)
    {
        var profile = await _context.StudentProfiles.FindAsync(id);
        if (profile is null) return (false, "Profile not found.");
        if (profile.UserId != userId) return (false, "Access denied.");

        _context.StudentProfiles.Remove(profile);
        await _context.SaveChangesAsync();
        return (true, "Profile deleted.");
    }

    private static StudentProfileResponse MapToResponse(StudentProfile s) => new()
    {
        Id = s.Id,
        UserId = s.UserId,
        Email = s.User?.Email ?? "",
        FullName = s.FullName,
        Bio = s.Bio,
        Skills = s.Skills,
        UniversityName = s.UniversityName,
        CreatedAt = s.CreatedAt
    };
}