using System.ComponentModel.DataAnnotations;

namespace ScientificLibraryBack.Models.DB
{
    public class Language
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;
    }
}
