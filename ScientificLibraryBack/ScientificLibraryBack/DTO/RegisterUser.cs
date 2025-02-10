namespace ScientificLibraryBack.DTO
{
    public class RegisterUser
    {
        public string? Email { get; set; }
        public string? UserName { get; set; }
        public string? Password { get; set; }
        public DateTime BirthDate { get; set; }
        public string? Phone { get; set; }
    }
}
