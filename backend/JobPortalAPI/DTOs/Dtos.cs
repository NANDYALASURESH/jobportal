using System.ComponentModel.DataAnnotations;

namespace JobPortalAPI.DTOs
{
    // Auth DTOs
    public class RegisterDto
    {
        [Required]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;
    }

    public class LoginDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }

    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public DateTime Expiration { get; set; }
    }

    // Job DTOs
    public class CreateJobDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Company { get; set; } = string.Empty;

        [Required]
        public string Location { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        public string Requirements { get; set; } = string.Empty;

        public string JobType { get; set; } = "Full-Time";
        public string Category { get; set; } = string.Empty;
        public string? SalaryRange { get; set; }
        public DateTime? Deadline { get; set; }
    }

    public class UpdateJobDto : CreateJobDto
    {
        public bool IsActive { get; set; } = true;
    }

    public class JobDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Company { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Requirements { get; set; } = string.Empty;
        public string JobType { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string? SalaryRange { get; set; }
        public bool IsActive { get; set; }
        public DateTime PostedAt { get; set; }
        public DateTime? Deadline { get; set; }
        public string PostedBy { get; set; } = string.Empty;
        public int ApplicationCount { get; set; }
    }

    // Application DTOs
    public class CreateApplicationDto
    {
        [Required]
        public string CoverLetter { get; set; } = string.Empty;
        public string? ResumeUrl { get; set; }
    }

    public class ApplicationDto
    {
        public int Id { get; set; }
        public int JobId { get; set; }
        public string JobTitle { get; set; } = string.Empty;
        public string Company { get; set; } = string.Empty;
        public string ApplicantName { get; set; } = string.Empty;
        public string ApplicantEmail { get; set; } = string.Empty;
        public string CoverLetter { get; set; } = string.Empty;
        public string? ResumeUrl { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime AppliedAt { get; set; }
    }

    public class UpdateApplicationStatusDto
    {
        [Required]
        public string Status { get; set; } = string.Empty; // Pending, Reviewed, Accepted, Rejected
    }
}
