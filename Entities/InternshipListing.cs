using static System.Net.Mime.MediaTypeNames;

namespace Skillin.Entities;

public class InternshipListing
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid CompanyProfileId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public CompanyProfile CompanyProfile { get; set; } = null!;
    public ICollection<Application> Applications { get; set; } = new List<Application>();


}

