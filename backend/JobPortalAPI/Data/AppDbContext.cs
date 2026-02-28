using JobPortalAPI.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace JobPortalAPI.Data
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Job> Jobs { get; set; }
        public DbSet<JobApplication> JobApplications { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Job>(entity =>
            {
                entity.HasKey(j => j.Id);
                entity.HasOne(j => j.PostedBy)
                      .WithMany()
                      .HasForeignKey(j => j.PostedById)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            builder.Entity<JobApplication>(entity =>
            {
                entity.HasKey(a => a.Id);
                entity.HasOne(a => a.Job)
                      .WithMany(j => j.Applications)
                      .HasForeignKey(a => a.JobId)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(a => a.Applicant)
                      .WithMany(u => u.Applications)
                      .HasForeignKey(a => a.ApplicantId)
                      .OnDelete(DeleteBehavior.Cascade);
                // Prevent duplicate applications
                entity.HasIndex(a => new { a.JobId, a.ApplicantId }).IsUnique();
            });
        }
    }
}
