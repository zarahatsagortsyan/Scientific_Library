using ScientificLibraryBack.Models.DB;
using ScientificLibraryBack.DTO;

namespace ScientificLibraryBack.Services.PublisherService
{
    public interface IPublisherService
    {
        Task<ApiResponse<Guid>> CreateBookAsync(BookCreateRequest bookRequest, IFormFile coverImage, IFormFile pdfFile); // Returns response with the ID of the newly created book
        Task<ApiResponse<Guid>> UpdateBookAsync(Guid id, BookCreateRequest book); 
        Task<ApiResponse<bool>> DeleteBookAsync(Guid bookId); 
        Task<ApiResponse<IEnumerable<Book>>> GetPublishedBooksAsync(string publisherId); 
        Task<ApiResponse<IEnumerable<Book>>> GetPendingBooksAsync(string publisherId); 
        Task<ApiResponse<IEnumerable<Book>>> GetRejectedBooksAsync(string publisherId); 
        Task<ApiResponse<Book>> ChangeAvailability(BookChangeAvailabilityRequest bookChangeAvailability);
        Task<ApiResponse<Book>> GetBookByIdAsync(Guid bookId); // Response containing the book details
    }
}
