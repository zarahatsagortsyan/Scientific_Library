using ScientificLibraryBack.Models.DB;

namespace ScientificLibraryBack.DTO
{
    public class UserBookDTO
    {
        public Guid Id { get; set; }
        public Guid BookId { get; set; }
        public string? UserId { get; set; }
        public DateTime? FinishedDate { get; set; }
        public ReadingStatus ReadingStatus { get; set; }
        public virtual BookDTO BookInfo { get; set; }
    }
}
