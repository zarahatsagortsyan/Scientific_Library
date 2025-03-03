using System.ComponentModel.DataAnnotations;

namespace ScientificLibraryBack.DTO
{
    public class RegisterReader
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        //[Required]
        //[MinLength(3, ErrorMessage = "Username must be at least 3 characters long.")]
        //public string UserName { get; set; } = string.Empty;

        [Required]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters long.")]
        public string Password { get; set; } = string.Empty;

        [Required]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [DataType(DataType.Date)]
        public DateTime BirthDate { get; set; }

        [Phone]
        public string? Phone { get; set; }
        public string? ClientUri { get; set; }  // ✅ Add this property for email confirmation URL
    }
}
