using Skillin.Application.DTOs;

namespace Skillin.Application.Interfaces;

public interface ICompanyService
{
    Task<List<CompanyProfileResponse>> GetAllAsync();
    Task<CompanyProfileResponse?> GetByIdAsync(Guid id);
    Task<CompanyProfileResponse?> GetByUserIdAsync(Guid userId);
    Task<(bool Success, string Message, CompanyProfileResponse? Data)> CreateAsync(Guid userId, CreateCompanyProfileRequest request);
    Task<(bool Success, string Message, CompanyProfileResponse? Data)> UpdateAsync(Guid id, Guid userId, UpdateCompanyProfileRequest request);
    Task<(bool Success, string Message)> DeleteAsync(Guid id, Guid userId);
}