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

        public string? ISBN { get; set; }  

        public DateTime PublicationDate { get; set; }
        public int PageCount { get; set; }

        [Required(ErrorMessage = "Language is required.")]
        public string Language { get; set; }
        public string Format { get; set; }
        public List<string> Keywords { get; set; } = new(); 
        public bool IsAvailable { get; set; }
        public State State { get; set; }
        public ApprovalStatus Status { get; set; }
        public string PublisherId { get; set; }
        public string PublisherName { get; set; }
        public double AverageRating { get; set; } 
    }

}
