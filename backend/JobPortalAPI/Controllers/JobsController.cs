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
    public class JobsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public JobsController(AppDbContext context)
        {
            _context = context;
        }

        // GET api/jobs - Public: Get all active jobs
        [HttpGet]
        public async Task<IActionResult> GetJobs(
            [FromQuery] string? search,
            [FromQuery] string? category,
            [FromQuery] string? jobType,
            [FromQuery] string? location)
        {
            var query = _context.Jobs
                .Include(j => j.PostedBy)
                .Include(j => j.Applications)
                .Where(j => j.IsActive)
                .AsQueryable();

            if (!string.IsNullOrEmpty(search))
                query = query.Where(j =>
                    j.Title.Contains(search) ||
                    j.Company.Contains(search) ||
                    j.Description.Contains(search));

            if (!string.IsNullOrEmpty(category))
                query = query.Where(j => j.Category == category);

            if (!string.IsNullOrEmpty(jobType))
                query = query.Where(j => j.JobType == jobType);

            if (!string.IsNullOrEmpty(location))
                query = query.Where(j => j.Location.Contains(location));

            var jobs = await query
                .OrderByDescending(j => j.PostedAt)
                .Select(j => new JobDto
                {
                    Id = j.Id,
                    Title = j.Title,
                    Company = j.Company,
                    Location = j.Location,
                    Description = j.Description,
                    Requirements = j.Requirements,
                    JobType = j.JobType,
                    Category = j.Category,
                    SalaryRange = j.SalaryRange,
                    IsActive = j.IsActive,
                    PostedAt = j.PostedAt,
                    Deadline = j.Deadline,
                    PostedBy = j.PostedBy != null ? j.PostedBy.FullName : "Admin",
                    ApplicationCount = j.Applications.Count
                })
                .ToListAsync();

            return Ok(jobs);
        }

        // GET api/jobs/{id} - Public: Get single job
        [HttpGet("{id}")]
        public async Task<IActionResult> GetJob(int id)
        {
            var job = await _context.Jobs
                .Include(j => j.PostedBy)
                .Include(j => j.Applications)
                .FirstOrDefaultAsync(j => j.Id == id);

            if (job == null) return NotFound(new { message = "Job not found." });

            return Ok(new JobDto
            {
                Id = job.Id,
                Title = job.Title,
                Company = job.Company,
                Location = job.Location,
                Description = job.Description,
                Requirements = job.Requirements,
                JobType = job.JobType,
                Category = job.Category,
                SalaryRange = job.SalaryRange,
                IsActive = job.IsActive,
                PostedAt = job.PostedAt,
                Deadline = job.Deadline,
                PostedBy = job.PostedBy?.FullName ?? "Admin",
                ApplicationCount = job.Applications.Count
            });
        }

        // POST api/jobs - Admin only: Create job
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateJob([FromBody] CreateJobDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

            var job = new Job
            {
                Title = dto.Title,
                Company = dto.Company,
                Location = dto.Location,
                Description = dto.Description,
                Requirements = dto.Requirements,
                JobType = dto.JobType,
                Category = dto.Category,
                SalaryRange = dto.SalaryRange,
                Deadline = dto.Deadline,
                PostedById = userId
            };

            _context.Jobs.Add(job);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetJob), new { id = job.Id }, new { message = "Job created successfully.", jobId = job.Id });
        }

        // PUT api/jobs/{id} - Admin only: Update job
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateJob(int id, [FromBody] UpdateJobDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var job = await _context.Jobs.FindAsync(id);
            if (job == null) return NotFound(new { message = "Job not found." });

            job.Title = dto.Title;
            job.Company = dto.Company;
            job.Location = dto.Location;
            job.Description = dto.Description;
            job.Requirements = dto.Requirements;
            job.JobType = dto.JobType;
            job.Category = dto.Category;
            job.SalaryRange = dto.SalaryRange;
            job.Deadline = dto.Deadline;
            job.IsActive = dto.IsActive;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Job updated successfully." });
        }

        // DELETE api/jobs/{id} - Admin only: Delete job
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteJob(int id)
        {
            var job = await _context.Jobs.FindAsync(id);
            if (job == null) return NotFound(new { message = "Job not found." });

            _context.Jobs.Remove(job);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Job deleted successfully." });
        }

        // GET api/jobs/admin/all - Admin only: Get all jobs including inactive
        [HttpGet("admin/all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllJobsForAdmin()
        {
            var jobs = await _context.Jobs
                .Include(j => j.PostedBy)
                .Include(j => j.Applications)
                .OrderByDescending(j => j.PostedAt)
                .Select(j => new JobDto
                {
                    Id = j.Id,
                    Title = j.Title,
                    Company = j.Company,
                    Location = j.Location,
                    Description = j.Description,
                    Requirements = j.Requirements,
                    JobType = j.JobType,
                    Category = j.Category,
                    SalaryRange = j.SalaryRange,
                    IsActive = j.IsActive,
                    PostedAt = j.PostedAt,
                    Deadline = j.Deadline,
                    PostedBy = j.PostedBy != null ? j.PostedBy.FullName : "Admin",
                    ApplicationCount = j.Applications.Count
                })
                .ToListAsync();

            return Ok(jobs);
        }
    }
}
