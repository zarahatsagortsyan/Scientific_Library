using System.ComponentModel.DataAnnotations;

namespace ScientificLibraryBack.DTO
{
    public class ForgotPasswordRequest
    {
        [Required]
        [EmailAddress]
        public string? Email { get; set; }

        [Required]
        public string? ClientUri { get; set; }
    }
}
