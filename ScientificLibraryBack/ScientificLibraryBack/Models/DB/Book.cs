using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.Data;

namespace ScientificLibraryBack.Models.DB
{
    public enum ApprovalStatus
    {
        Pending,   // Book is waiting for approval
        Approved,  // Book has been approved by the admin
        Rejected   // Book was rejected by the admin
    }

    public enum State
    {
        New,   // Book is new
        Edited,  // Book is edited
        Deleted   // Book is deleted
    }

    public class Book
    {
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Title is required.")]
        public string Title { get; set; }

        [Required(ErrorMessage = "Author is required.")]
        public string Author { get; set; }

        [Required(ErrorMessage = "Genre is required.")]
        public int GenreId { get; set; }  
        public Genre Genre { get; set; }  

        [Required(ErrorMessage = "Description is required.")]
        public string? Description { get; set; }

        [Required(ErrorMessage = "ISBN is required.")]
        public string? ISBN { get; set; }  

        public byte[]? CoverImage { get; set; } 
        public string? CoverImageUrl { get; set; } 

        public byte[]? PdfFile { get; set; } 
        public string? PdfFileName { get; set; } 

        public DateTime PublicationDate { get; set; }
        public int PageCount { get; set; }

        [Required(ErrorMessage = "Language is required.")]
        public string Language { get; set; }

        public string? Format { get; set; }
        public bool IsAvailable { get; set; }

        public State State { get; set; }
        public ApprovalStatus Status { get; set; }

        public string PublisherId { get; set; }
        public ExtendedIdentityUser Publisher { get; set; }

        public virtual ICollection<Review> Reviews { get; set; }
        public ICollection<BookKeyword> BookKeywords { get; set; } = new List<BookKeyword>();
    }

}

