using Skillin.Entities;
using Microsoft.EntityFrameworkCore;

namespace Skillin.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<StudentProfile> StudentProfiles { get; set; }
    public DbSet<CompanyProfile> CompanyProfiles { get; set; }
    public DbSet<InternshipListing> Listings { get; set; }
    public DbSet<Application> Applications { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        
        modelBuilder.Entity<User>()
            .HasOne(u => u.StudentProfile)
            .WithOne(s => s.User)
            .HasForeignKey<StudentProfile>(s => s.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        
        modelBuilder.Entity<User>()
            .HasOne(u => u.CompanyProfile)
            .WithOne(c => c.User)
            .HasForeignKey<CompanyProfile>(c => c.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        
        modelBuilder.Entity<CompanyProfile>()
            .HasMany(c => c.Listings)
            .WithOne(l => l.CompanyProfile)
            .HasForeignKey(l => l.CompanyProfileId)
            .OnDelete(DeleteBehavior.Cascade);

        
        modelBuilder.Entity<InternshipListing>()
            .HasMany(l => l.Applications)
            .WithOne(a => a.Listing)
            .HasForeignKey(a => a.ListingId)
            .OnDelete(DeleteBehavior.Cascade);

        
        modelBuilder.Entity<Application>()
            .HasIndex(a => new { a.ListingId, a.StudentProfileId })
            .IsUnique();
    }


}

