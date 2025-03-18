namespace ScientificLibraryBack.Models.DB
{
    public class Message
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Content { get; set; }
        public string Status { get; set; } = "Pending"; // Default status
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
