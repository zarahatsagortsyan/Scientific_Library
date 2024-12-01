using Microsoft.AspNetCore.Identity;
using ScientificLibraryBack.Models;
using System.Collections;

namespace ScientificLibraryBack.Services
{
    public interface IUserService
    {
        Task<IEnumerable<IdentityUser>> GetUsersAsync();
        Task<IdentityResult> DeleteUserAsync(string userId);

    }
}
