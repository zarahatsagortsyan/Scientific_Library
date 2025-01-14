using ScientificLibraryBack.Models.DB;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using static Microsoft.Extensions.Logging.EventSource.LoggingEventSource;
using System.Collections.Generic;
using ScientificLibraryBack.Models;
using ScientificLibraryBack.DTO;

namespace ScientificLibraryBack.Services.BookService
{
    public interface IReaderService
    {
        Task<ApiResponse<Guid>> AddBookToUserListAsync(Guid bookId, string userId, ReadingStatus status);
        Task<ApiResponse<bool>> RemoveBookFromUserList(string userId, Guid bookId);
        Task<ApiResponse<bool>> UpdateReadingStatusAsync(Guid bookId, string userId, ReadingStatus newStatus);
        Task<ApiResponse<IEnumerable<UserBook>>> GetUserBooksAsync(string userId, ReadingStatus? status = null);


        Task<ApiResponse<Review>> AddReviewAsync(string userId, Guid bookId, string reviewText, int rating);
        Task<ApiResponse<bool>> DeleteReviewAsync(string userId, Guid bookId);
        Task<ApiResponse<IEnumerable<Review>>> GetUserReviewedBooksAsync(string userId);
    }

}
