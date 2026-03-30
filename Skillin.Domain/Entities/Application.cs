using Skillin.Domain.Enums;

namespace Skillin.Domain.Entities;

public class JobApplication
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ListingId { get; set; }
    public Guid StudentProfileId { get; set; }
    public string CoverLetter { get; set; } = string.Empty;
    public ApplicationStatus Status { get; set; } = ApplicationStatus.Pending;
    public DateTime AppliedAt { get; set; } = DateTime.UtcNow;

    public InternshipListing Listing { get; set; } = null!;
    public StudentProfile StudentProfile { get; set; } = null!;
}