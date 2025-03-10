using ScientificLibraryBack.Models.DB;
using System.ComponentModel.DataAnnotations;

namespace ScientificLibraryBack.DTO
{
    public class BookDTO
    {

        public Guid Id { get; set; }

        public string Title { get; set; }

        public string Author { get; set; }

        public string Genre { get; set; }

        public string? Description { get; set; }

        public string? ISBN { get; set; }  // ISBN of the book

        //public string? CoverImageUrl { get; set; } // If storing the image in a file system

        //public string? PdfFileName { get; set; } // ✅ To store the original file name

        public DateTime PublicationDate { get; set; }
        public int PageCount { get; set; }

        [Required(ErrorMessage = "Language is required.")]
        public string Language { get; set; }

        public string Format { get; set; }
        //public string Keywords { get; set; }
        public List<string> Keywords { get; set; } = new(); // List of keyword names

        public bool IsAvailable { get; set; }

        public State State { get; set; }
        public ApprovalStatus Status { get; set; }

        // Publisher Information
        public string PublisherId { get; set; }
        public string PublisherName { get; set; }
        //public ExtendedIdentityUser Publisher { get; set; }

        // Navigation property for Reviews
        //public virtual ICollection<Review> Reviews { get; set; }
    }

}
