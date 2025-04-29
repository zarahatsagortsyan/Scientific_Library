namespace ScientificLibraryBack.DTO
{
    public enum BookOrderBy
    {
        DatePublished,
        Rating,
        ReadCount
    }

    public class BookFilterRequest
    {
        public string? Title { get; set; }
        public string? Author { get; set; }
        public List<int>? Genres { get; set; } = new();
        public List<string>? Languages { get; set; } = new();
        public List<string>? Keywords { get; set; } = new();

        // Pagination
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 7;

        // Sorting
        public BookOrderBy OrderBy { get; set; } = BookOrderBy.DatePublished;
        public bool IsDescending { get; set; } = true;
    }


}
