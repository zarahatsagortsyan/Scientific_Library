namespace ScientificLibraryBack.DTO
{

    public class BookFilterRequest
    {
        public string? Title { get; set; }
        public string? Author { get; set; }
        public List<int>? GenreIds { get; set; }  
        public List<string>? Languages { get; set; }  
        public List<string>? Keywords { get; set; } 
    }

}
