using ScientificLibraryBack.Models.DB;

namespace ScientificLibraryBack.DTO
{
    public class UserBookRemoveRequest
    {
        public Guid BookId { get; set; }
        public string UserId { get; set; }
    }
}
