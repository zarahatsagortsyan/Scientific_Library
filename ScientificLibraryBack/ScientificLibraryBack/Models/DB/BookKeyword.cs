using System.ComponentModel.DataAnnotations;

namespace ScientificLibraryBack.Models.DB
{
    public class BookKeyword
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid BookId { get; set; }

        [Required]
        public Guid KeywordId { get; set; }

        // Navigation Properties
        public Book Book { get; set; }
        public Keyword Keyword { get; set; }
    }
}
