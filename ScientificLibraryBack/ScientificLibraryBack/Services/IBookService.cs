using ScientificLibraryBack.Models.DB;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using static Microsoft.Extensions.Logging.EventSource.LoggingEventSource;
using System.Collections.Generic;
using ScientificLibraryBack.Models;

namespace ScientificLibraryBack.Services
{
    public interface IBookService
    {
        Task<ApiResponse<Guid>> CreateBookAsync(Book book); // Returns response with the ID of the newly created book
        Task<ApiResponse<bool>> UpdateBookAsync(Book book); // Response indicating success or failure of update
        Task<ApiResponse<bool>> DeleteBookAsync(Guid bookId); // Response indicating success or failure of deletion
        Task<Book> GetBookByIdAsync(Guid bookId); // Response containing the book details
        Task<ApiResponse<IEnumerable<Book>>> GetAllBooksAsync(); // Response with a collection of all books
        Task<ApiResponse<IEnumerable<Book>>> GetBooksByGenreAsync(string genre); // Response filtered by genre
        Task<ApiResponse<IEnumerable<Book>>> SearchBooksAsync(string keyword); // Response for keyword search
    }

}
