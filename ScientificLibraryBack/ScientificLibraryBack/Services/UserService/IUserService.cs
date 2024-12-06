using Microsoft.AspNetCore.Identity;
using ScientificLibraryBack.Models;
using ScientificLibraryBack.Models.DB;
using System.Collections;

namespace ScientificLibraryBack.Services.UserService
{
    public interface IUserService
    {
        Task<IEnumerable<ExtendedIdentityUser>> GetUsersAsync();
        Task<IEnumerable<ExtendedIdentityUser>> GetActiveReadersAsync();
        Task<IEnumerable<ExtendedIdentityUser>> GetActivePublishersAsync();
        Task<IdentityResult> DeleteUserAsync(string userId);
    }
}
