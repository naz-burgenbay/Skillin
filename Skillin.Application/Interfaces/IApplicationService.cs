using Skillin.Application.DTOs;

namespace Skillin.Application.Interfaces;

public interface IApplicationService
{
    Task<List<ApplicationResponse>> GetByStudentAsync(Guid userId);
    Task<List<ApplicationResponse>> GetByListingAsync(Guid listingId, Guid userId);
    Task<(bool Success, string Message, ApplicationResponse? Data)> ApplyAsync(Guid userId, CreateApplicationRequest request);
    Task<(bool Success, string Message, ApplicationResponse? Data)> UpdateStatusAsync(Guid id, Guid userId, UpdateApplicationStatusRequest request);
    Task<(bool Success, string Message)> WithdrawAsync(Guid id, Guid userId);
}