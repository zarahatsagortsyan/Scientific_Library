using System.ComponentModel.DataAnnotations;

namespace ScientificLibraryBack.Models.DB
{
    public class Keyword
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        // Navigation Property for Many-to-Many Relationship
        public ICollection<BookKeyword> BookKeywords { get; set; } = new List<BookKeyword>();

    }
}
