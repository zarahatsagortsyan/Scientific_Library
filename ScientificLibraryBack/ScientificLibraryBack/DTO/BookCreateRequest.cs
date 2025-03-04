using ScientificLibraryBack.Models.DB;
using System.ComponentModel.DataAnnotations;

namespace ScientificLibraryBack.DTO
{
    public class BookCreateRequest
    {
        //public Guid Id { get; set; }

        [Required(ErrorMessage = "Title is required.")]
        public string Title { get; set; }

        [Required(ErrorMessage = "Author is required.")]
        public string Author { get; set; }

        [Required(ErrorMessage = "Genre is required.")]
        public string Genre { get; set; }

        [Required(ErrorMessage = "Description is required.")]
        public string Description { get; set; }

        [Required(ErrorMessage = "ISBN is required.")]
        public string ISBN { get; set; }  // ISBN of the book
        public byte[]? CoverImage { get; set; } // If storing the image in the database
        //public string CoverImageUrl { get; set; } // If storing the image in a file system
        public DateTime PublicationDate { get; set; }  // Date when the book was published
        public int PageCount { get; set; }  // Number of pages

        [Required(ErrorMessage = "Language is required.")]
        public string Language { get; set; }  // Language of the book

        public string Format { get; set; }  // eBook, Audiobook, etc.
        //public string Keywords { get; set; }  // In the database, this will be stored as nvarchar
        public bool IsAvailable { get; set; }  // Availability status
        public string? PublisherId { get; set; }  // Foreign Key to AspNetUsers
        public List<string> Keywords { get; set; } = new(); // List of keyword names

    }
}
