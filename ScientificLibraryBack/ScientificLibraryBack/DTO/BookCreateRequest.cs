using ScientificLibraryBack.Models.DB;
using System.ComponentModel.DataAnnotations;

namespace ScientificLibraryBack.DTO
{
    public class BookCreateRequest
    {
        [Required(ErrorMessage = "Title is required.")]
        public string Title { get; set; }

        [Required(ErrorMessage = "Author is required.")]
        public string Author { get; set; }

        [Required(ErrorMessage = "Genre is required.")]
        public int GenreId { get; set; }  

        [Required(ErrorMessage = "Description is required.")]
        public string Description { get; set; }

        [Required(ErrorMessage = "ISBN is required.")]
        public string ISBN { get; set; }  
        public byte[]? CoverImage { get; set; } 
        public DateTime PublicationDate { get; set; }  
        public int PageCount { get; set; } 
        [Required(ErrorMessage = "Language is required.")]
        public string Language { get; set; }  

        public string? Format { get; set; }  
        public bool IsAvailable { get; set; } 
        public string? PublisherId { get; set; }  
        public List<string> Keywords { get; set; } = new(); 
    }
}
