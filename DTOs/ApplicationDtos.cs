using Skillin.Enums;

namespace Skillin.DTOs;


public class CreateApplicationRequest
{
    public Guid ListingId { get; set; }
    public string CoverLetter { get; set; } = string.Empty;
}

public class UpdateApplicationStatusRequest
{
    public ApplicationStatus Status { get; set; }
}

public class ApplicationResponse
{
    public Guid Id { get; set; }
    public Guid ListingId { get; set; }
    public string ListingTitle { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public Guid StudentProfileId { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public string CoverLetter { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime AppliedAt { get; set; }
}

