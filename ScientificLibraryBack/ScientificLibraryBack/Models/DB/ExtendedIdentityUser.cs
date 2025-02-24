using Microsoft.AspNetCore.Identity;

namespace ScientificLibraryBack.Models.DB
{

    public enum UserType
    { 
        Reader,
        Publisher,
        Admin    
    }
    public class ExtendedIdentityUser : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public UserType Type { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsActive { get; set; }
        public bool Banned { get; set; } //banned or not

        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }
    }
}
