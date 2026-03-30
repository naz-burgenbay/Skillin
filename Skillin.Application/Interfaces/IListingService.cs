using Skillin.Application.DTOs;

namespace Skillin.Application.Interfaces;

public interface IListingService
{
    Task<List<ListingResponse>> GetAllAsync(string? search = null);
    Task<ListingResponse?> GetByIdAsync(Guid id);
    Task<List<ListingResponse>> GetByCompanyAsync(Guid companyProfileId);
    Task<(bool Success, string Message, ListingResponse? Data)> CreateAsync(Guid userId, CreateListingRequest request);
    Task<(bool Success, string Message, ListingResponse? Data)> UpdateAsync(Guid id, Guid userId, UpdateListingRequest request);
    Task<(bool Success, string Message)> DeleteAsync(Guid id, Guid userId);
}