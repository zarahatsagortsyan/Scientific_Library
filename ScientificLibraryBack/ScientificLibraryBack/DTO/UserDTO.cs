using ScientificLibraryBack.Models.DB;

namespace ScientificLibraryBack.DTO
{
    public class UserDTO
    {
        public string Id { get; set; }
        //public string UserName { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? CompanyName { get; set; }
        public string Email { get; set; }
        public UserType Type { get; set; }
        public bool Banned { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime BirthDate { get; set; }

    }
}
