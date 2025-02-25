namespace ScientificLibraryBack.DTO
{
    public class UpdateGenreRequest
    {
        public int genreId { get; set; }
        public string? name { get; set; }
        public string? genreDescription { get; set; }
    }
}
