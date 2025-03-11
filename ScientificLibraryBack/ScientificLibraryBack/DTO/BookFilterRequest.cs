namespace ScientificLibraryBack.DTO
{

    public class BookFilterRequest
    {
        public string? Title { get; set; }
        public string? Author { get; set; }
        public List<int>? Genres { get; set; } = new(); // Multi-select genres
        public List<string>? Languages { get; set; } = new(); // Multi-select languages
        public List<string>? Keywords { get; set; } = new(); // Multi-select keywords
    }




}
