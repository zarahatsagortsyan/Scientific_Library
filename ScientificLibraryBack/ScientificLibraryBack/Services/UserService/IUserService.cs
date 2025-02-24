using Microsoft.AspNetCore.Identity;
using ScientificLibraryBack.DTO;
using ScientificLibraryBack.Models;
using ScientificLibraryBack.Models.DB;
using System.Collections;

namespace ScientificLibraryBack.Services.UserService
{
    public interface IUserService
    {
        Task<IEnumerable<ExtendedIdentityUser>> GetUsersAsync();
        //Task<IEnumerable<ExtendedIdentityUser>> GetActiveReadersAsync();
        Task<ApiResponse<IEnumerable<UserDTO>>> GetActiveReadersAsync();
        Task<ApiResponse<IEnumerable<UserDTO>>> GetActivePublishersAsync();

        //Task<IEnumerable<ExtendedIdentityUser>> GetActivePublishersAsync();
        Task<IdentityResult> DeleteUserAsync(string userId);
        Task<ApiResponse<bool>> BanUser(string userId);
        Task<ApiResponse<bool>> UnBanUser(string userId);


    }
}
