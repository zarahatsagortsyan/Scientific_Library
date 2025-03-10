using Microsoft.AspNetCore.Mvc;
using ScientificLibraryBack.DTO;
using ScientificLibraryBack.Models.DB;
using System.Threading.Tasks;

namespace ScientificLibraryBack.Services.AdminService
{
    public interface IAdminService
    {
        Task<ApiResponse<bool>> ApproveBook(Guid bookId);
        Task<ApiResponse<bool>> RejectBook(Guid bookId);
        Task<ApiResponse<bool>> CreateGenre(CreateGenreRequest genreRequest);
        Task<ApiResponse<bool>> AddKeyword([FromBody] string keywordName);
        Task<ApiResponse<bool>> DeleteGenre(int id);
        Task<ApiResponse<bool>> UpdateGenre(UpdateGenreRequest genreRequest);
        Task<ApiResponse<bool>> UpdateKeyword(Guid id, string newName);
        Task<ApiResponse<IEnumerable<BookDTO>>> GetPendingBooks();
        Task<ApiResponse<IEnumerable<BookDTO>>> GetRejectedBooks();
        Task<ApiResponse<IEnumerable<BookDTO>>> GetApprovedBooks();
    }
}
