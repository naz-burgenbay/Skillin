using Skillin.Application.DTOs;

namespace Skillin.Application.Interfaces;

public interface IStudentService
{
    Task<List<StudentProfileResponse>> GetAllAsync();
    Task<StudentProfileResponse?> GetByIdAsync(Guid id);
    Task<StudentProfileResponse?> GetByUserIdAsync(Guid userId);
    Task<(bool Success, string Message, StudentProfileResponse? Data)> CreateAsync(Guid userId, CreateStudentProfileRequest request);
    Task<(bool Success, string Message, StudentProfileResponse? Data)> UpdateAsync(Guid id, Guid userId, UpdateStudentProfileRequest request);
    Task<(bool Success, string Message)> DeleteAsync(Guid id, Guid userId);
}