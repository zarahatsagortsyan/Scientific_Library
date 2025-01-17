namespace ScientificLibraryBack.DTO
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public T? Data { get; set; } // Generic type for any kind of data (e.g., Book, User, etc.)

    }
}
