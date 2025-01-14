using ScientificLibraryBack.Models.DB;

namespace ScientificLibraryBack.DTO
{
    public class UpdateReadingStatusRequest
    {
        public Guid BookId { get; set; }
        public string UserId { get; set; }
        public ReadingStatus ReadingStatus { get; set; }
    }
}
