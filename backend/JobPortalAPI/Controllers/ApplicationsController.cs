using JobPortalAPI.Data;
using JobPortalAPI.DTOs;
using JobPortalAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace JobPortalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ApplicationsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ApplicationsController(AppDbContext context)
        {
            _context = context;
        }

        // POST api/applications/job/{jobId} - User: Apply to a job
        [HttpPost("job/{jobId}")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> ApplyToJob(int jobId, [FromBody] CreateApplicationDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

            var job = await _context.Jobs.FindAsync(jobId);
            if (job == null || !job.IsActive)
                return NotFound(new { message = "Job not found or no longer active." });

            var existingApp = await _context.JobApplications
                .FirstOrDefaultAsync(a => a.JobId == jobId && a.ApplicantId == userId);

            if (existingApp != null)
                return BadRequest(new { message = "You have already applied for this job." });

            var application = new JobApplication
            {
                JobId = jobId,
                ApplicantId = userId,
                CoverLetter = dto.CoverLetter,
                ResumeUrl = dto.ResumeUrl
            };

            _context.JobApplications.Add(application);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Application submitted successfully." });
        }

        // GET api/applications/my - User: Get my applications
        [HttpGet("my")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> GetMyApplications()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

            var applications = await _context.JobApplications
                .Include(a => a.Job)
                .Include(a => a.Applicant)
                .Where(a => a.ApplicantId == userId)
                .OrderByDescending(a => a.AppliedAt)
                .Select(a => new ApplicationDto
                {
                    Id = a.Id,
                    JobId = a.JobId,
                    JobTitle = a.Job != null ? a.Job.Title : "",
                    Company = a.Job != null ? a.Job.Company : "",
                    ApplicantName = a.Applicant != null ? a.Applicant.FullName : "",
                    ApplicantEmail = a.Applicant != null ? a.Applicant.Email! : "",
                    CoverLetter = a.CoverLetter,
                    ResumeUrl = a.ResumeUrl,
                    Status = a.Status,
                    AppliedAt = a.AppliedAt
                })
                .ToListAsync();

            return Ok(applications);
        }

        // GET api/applications/job/{jobId} - Admin: Get applications for a job
        [HttpGet("job/{jobId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetApplicationsForJob(int jobId)
        {
            var job = await _context.Jobs.FindAsync(jobId);
            if (job == null) return NotFound(new { message = "Job not found." });

            var applications = await _context.JobApplications
                .Include(a => a.Applicant)
                .Where(a => a.JobId == jobId)
                .OrderByDescending(a => a.AppliedAt)
                .Select(a => new ApplicationDto
                {
                    Id = a.Id,
                    JobId = a.JobId,
                    JobTitle = job.Title,
                    Company = job.Company,
                    ApplicantName = a.Applicant != null ? a.Applicant.FullName : "",
                    ApplicantEmail = a.Applicant != null ? a.Applicant.Email! : "",
                    CoverLetter = a.CoverLetter,
                    ResumeUrl = a.ResumeUrl,
                    Status = a.Status,
                    AppliedAt = a.AppliedAt
                })
                .ToListAsync();

            return Ok(applications);
        }

        // GET api/applications/admin/all - Admin: Get all applications
        [HttpGet("admin/all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllApplications()
        {
            var applications = await _context.JobApplications
                .Include(a => a.Job)
                .Include(a => a.Applicant)
                .OrderByDescending(a => a.AppliedAt)
                .Select(a => new ApplicationDto
                {
                    Id = a.Id,
                    JobId = a.JobId,
                    JobTitle = a.Job != null ? a.Job.Title : "",
                    Company = a.Job != null ? a.Job.Company : "",
                    ApplicantName = a.Applicant != null ? a.Applicant.FullName : "",
                    ApplicantEmail = a.Applicant != null ? a.Applicant.Email! : "",
                    CoverLetter = a.CoverLetter,
                    ResumeUrl = a.ResumeUrl,
                    Status = a.Status,
                    AppliedAt = a.AppliedAt
                })
                .ToListAsync();

            return Ok(applications);
        }

        // PUT api/applications/{id}/status - Admin: Update application status
        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateApplicationStatusDto dto)
        {
            var validStatuses = new[] { "Pending", "Reviewed", "Accepted", "Rejected" };
            if (!validStatuses.Contains(dto.Status))
                return BadRequest(new { message = "Invalid status value." });

            var application = await _context.JobApplications.FindAsync(id);
            if (application == null) return NotFound(new { message = "Application not found." });

            application.Status = dto.Status;
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Application status updated to {dto.Status}." });
        }
    }
}
