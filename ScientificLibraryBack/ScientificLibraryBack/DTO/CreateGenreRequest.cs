using System.ComponentModel.DataAnnotations;

namespace ScientificLibraryBack.DTO
{
    public class CreateGenreRequest
    {
        [Required(ErrorMessage ="Field Name is required")]
        public string? Name { get; set; }
        public string? Description { get; set; }

    }
}
