using ScientificLibraryBack.DTO;

namespace ScientificLibraryBack.Services.AdminService
{
    public interface IAdminService
    {
        Task<ApiResponse<bool>> ApproveBook(Guid bookId);
        Task<ApiResponse<bool>> RejectBook(Guid bookId);
        Task<ApiResponse<bool>> CreateGenre(CreateGenreRequest genreRequest);
        Task<ApiResponse<bool>> DeleteGenre(int id);
        Task<ApiResponse<bool>> UpdateGenre(UpdateGenreRequest genreRequest);
    }
}
