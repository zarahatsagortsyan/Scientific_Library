using Microsoft.AspNetCore.Identity;
using ScientificLibraryBack.Models;
using ScientificLibraryBack.Models.DB;
using System.Collections;

namespace ScientificLibraryBack.Services
{
    public interface IUserService
    {
        Task<IEnumerable<ExtendedIdentityUser>> GetUsersAsync();
        Task<IdentityResult> DeleteUserAsync(string userId);

    }
}
