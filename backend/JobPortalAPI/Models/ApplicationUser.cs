using Microsoft.AspNetCore.Identity;

namespace JobPortalAPI.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<JobApplication> Applications { get; set; } = new List<JobApplication>();
    }
}
