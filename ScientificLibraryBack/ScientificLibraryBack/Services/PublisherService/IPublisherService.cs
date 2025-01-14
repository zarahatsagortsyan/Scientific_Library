using ScientificLibraryBack.Models.DB;
using ScientificLibraryBack.DTO;

namespace ScientificLibraryBack.Services.PublisherService
{
    public interface IPublisherService
    {
        Task<ApiResponse<Guid>> CreateBookAsync(BookCreateRequest book); // Returns response with the ID of the newly created book
        Task<ApiResponse<Guid>> UpdateBookAsync(Guid id, BookCreateRequest book); // Response indicating success or failure of update
        Task<ApiResponse<bool>> DeleteBookAsync(Guid bookId); // Response indicating success or failure of deletion
        Task<ApiResponse<IEnumerable<Book>>> GetPublishedBooksAsync(string publisherId); // Response with a collection of all books
        Task<ApiResponse<IEnumerable<Book>>> GetPendingBooksAsync(string publisherId); // Response for keyword search
        Task<ApiResponse<IEnumerable<Book>>> GetRejectedBooksAsync(string publisherId); // Response for keyword search
        Task<ApiResponse<bool>> ChangeAvailibility(bool available); // Response with a collection of all books
        Task<ApiResponse<Book>> GetBookByIdAsync(Guid bookId); // Response containing the book details
    }
}
