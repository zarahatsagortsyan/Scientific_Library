namespace ScientificLibraryBack.Models.DB
{
    public enum ReadingStatus
    {
        ToRead,   
        Reading,  
        Read   
    }

    public class UserBook
    {
        public Guid Id { get; set; }
        public Guid BookId { get; set; }
        public string? UserId { get; set; }
        public DateTime? FinishedDate { get; set; }
        public ReadingStatus ReadingStatus { get; set; }
    }
}
