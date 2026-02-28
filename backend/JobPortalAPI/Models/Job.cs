using System.ComponentModel.DataAnnotations;

namespace JobPortalAPI.Models
{
    public class Job
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Company { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Location { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        public string Requirements { get; set; } = string.Empty;

        [MaxLength(50)]
        public string JobType { get; set; } = "Full-Time"; // Full-Time, Part-Time, Remote, Contract

        [MaxLength(50)]
        public string Category { get; set; } = string.Empty;

        public string? SalaryRange { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime PostedAt { get; set; } = DateTime.UtcNow;

        public DateTime? Deadline { get; set; }

        public string PostedById { get; set; } = string.Empty;

        public ApplicationUser? PostedBy { get; set; }

        public ICollection<JobApplication> Applications { get; set; } = new List<JobApplication>();
    }
}
