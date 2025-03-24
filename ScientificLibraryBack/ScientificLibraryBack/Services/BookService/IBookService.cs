using ScientificLibraryBack.Models.DB;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using static Microsoft.Extensions.Logging.EventSource.LoggingEventSource;
using System.Collections.Generic;
using ScientificLibraryBack.DTO;
using ScientificLibraryBack.Models;

namespace ScientificLibraryBack.Services.BookService
{
    public interface IBookService
    {
        Task<ApiResponse<BookDTO>> GetBookByIdAsync(Guid bookId);
        Task<ApiResponse<byte[]>> GetBookCoverImage(Guid bookId);
        Task<ApiResponse<PDFDTO>> GetBookPDF(Guid bookId);
        Task<ApiResponse<IEnumerable<BookDTO>>> GetAllBooksAsync(); 
        Task<IEnumerable<Book>> GetBooksByGenreAsync(string genre); 
        Task<ApiResponse<IEnumerable<ReviewDTO>>> GetReviewsForBookAsync(Guid bookId);
        Task<ApiResponse<IEnumerable<Genre>>> GetGenresAsync();
        Task<ApiResponse<IEnumerable<Language>>> GetLanguagesAsync();
        Task<ApiResponse<IEnumerable<Keyword>>> GetKeywordsAsync();
        //Task<ApiResponse<IEnumerable<BookDTO>>> FilterBooksAsync(BookFilterRequest filter);
        Task<ApiResponse<PagedResult<BookDTO>>> FilterBooksAsync(BookFilterRequest filter);
    }
}
