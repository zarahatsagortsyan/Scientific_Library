using ScientificLibraryBack.Models.DB;
using ScientificLibraryBack.DTO;

namespace ScientificLibraryBack.Services.PublisherService
{
    public interface IPublisherService
    {
        Task<ApiResponse<Guid>> CreateBookAsync(BookCreateRequest bookRequest, IFormFile coverImage, IFormFile pdfFile); // Returns response with the ID of the newly created book
        Task<ApiResponse<Guid>> UpdateBookAsync(Guid id, BookCreateRequest book); 
        Task<ApiResponse<bool>> DeleteBookAsync(Guid bookId); 
        Task<ApiResponse<IEnumerable<BookDTO>>> GetPublishedBooksAsync(string publisherId); 
        Task<ApiResponse<IEnumerable<BookDTO>>> GetPendingBooksAsync(string publisherId); 
        Task<ApiResponse<IEnumerable<BookDTO>>> GetRejectedBooksAsync(string publisherId); 
        Task<ApiResponse<Book>> ChangeAvailability(BookChangeAvailabilityRequest bookChangeAvailability);
        Task<ApiResponse<Book>> GetBookByIdAsync(Guid bookId); // Response containing the book details
        Task<ApiResponse<string>> UpdatePublisherProfileAsync(string userId, PublisherProfileDTO profile);
        Task<ApiResponse<PublisherProfileDTO>> GetPublisherProfileAsync(string userId);
    }
}
