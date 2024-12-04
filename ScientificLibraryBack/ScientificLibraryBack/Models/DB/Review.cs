using Microsoft.AspNetCore.Identity;

namespace ScientificLibraryBack.Models.DB
{
    public class Review
    {
        public int Id { get; set; }  // Unique identifier for each review
        public string ReviewText { get; set; }  // The text content of the review
        public int Rating { get; set; }  // Rating value (1-5 or 1-10, depending on your system)
        public DateTime CreatedAt { get; set; }  // Timestamp for when the review was created

        public string UserId { get; set; }  // FK to User (AspNetUser)
        public virtual ExtendedIdentityUser User { get; set; }  // Navigation property for User

        public Guid BookId { get; set; }  // FK to Book
        public virtual Book Book { get; set; }  // Navigation property for Book

    }
}
