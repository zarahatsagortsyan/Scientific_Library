using ScientificLibraryBack.Models.DB;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using static Microsoft.Extensions.Logging.EventSource.LoggingEventSource;
using System.Collections.Generic;
using ScientificLibraryBack.Models;

namespace ScientificLibraryBack.Services.BookService
{
    public interface IBookService
    {
        Task<ApiResponse<Guid>> CreateBookAsync(BookCreateRequest book); // Returns response with the ID of the newly created book
        Task<ApiResponse<Guid>> UpdateBookAsync(Guid id, BookCreateRequest book); // Response indicating success or failure of update
        Task<ApiResponse<bool>> DeleteBookAsync(Guid bookId); // Response indicating success or failure of deletion

        Task<ApiResponse<Book>> GetBookByIdAsync(Guid bookId); // Response containing the book details
        Task<ApiResponse<IEnumerable<Book>>> GetAllBooksAsync(); // Response with a collection of all books
        Task<ApiResponse<IEnumerable<Book>>> GetPublishedBooksAsync(string publisherId); // Response with a collection of all books
        //Task<IEnumerable<Book>> GetMySavedBooksAsync(string readerId); // Response with a collection of all books
        Task<ApiResponse<IEnumerable<Book>>> GetPendingBooksAsync(string publisherId); // Response for keyword search
        Task<ApiResponse<IEnumerable<Book>>> GetRejectedBooksAsync(string publisherId); // Response for keyword search
        //Task<IEnumerable<Book>> GetApprovedBooksAsync(Guid publisherId); // Response for keyword search


        Task<ApiResponse<bool>> ChangeAvailibility(bool available); // Response with a collection of all books



        Task<IEnumerable<Book>> GetBooksByGenreAsync(string genre); // Response filtered by genre
        Task<ApiResponse<IEnumerable<Book>>> SearchBooksAsync(string keyword); // Response for keyword search



        Task<ApiResponse<bool>> ApproveBook(Guid bookId);
        Task<ApiResponse<bool>> RejectBook(Guid bookId);


    }

}
