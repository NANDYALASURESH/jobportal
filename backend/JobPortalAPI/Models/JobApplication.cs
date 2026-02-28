using System.ComponentModel.DataAnnotations;

namespace JobPortalAPI.Models
{
    public class JobApplication
    {
        public int Id { get; set; }

        public int JobId { get; set; }
        public Job? Job { get; set; }

        public string ApplicantId { get; set; } = string.Empty;
        public ApplicationUser? Applicant { get; set; }

        [Required]
        public string CoverLetter { get; set; } = string.Empty;

        public string? ResumeUrl { get; set; }

        [MaxLength(50)]
        public string Status { get; set; } = "Pending"; // Pending, Reviewed, Accepted, Rejected

        public DateTime AppliedAt { get; set; } = DateTime.UtcNow;
    }
}
