namespace ScientificLibraryBack.DTO
{
    public class BookChangeAvailabilityRequest
    {
        public string PublisherId { get; set; }
        public Guid BookId { get; set; }
        public bool Availability { get; set; }
    }
}
