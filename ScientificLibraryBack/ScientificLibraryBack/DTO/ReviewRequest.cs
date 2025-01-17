namespace ScientificLibraryBack.DTO
{
    public class ReviewRequest
    {
        public string UserId { get; set; }   // The user who is submitting the review
        public Guid BookId { get; set; }     // The book being reviewed
        public string ReviewText { get; set; } // The text content of the review
        public int Rating { get; set; }      // Rating value (1-5 or 1-10 depending on your system)
    }
}
