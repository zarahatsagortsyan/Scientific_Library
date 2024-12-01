using ScientificLibraryBack.Models;

namespace ScientificLibraryBack.Services
{
    public interface IAuthService
    {
        string GenerateTokenString(LoginUser user);
        Task<bool> Login(LoginUser user);
        Task<bool> RegisterReader(LoginUser user);
        IEnumerable<string> GetUserRole(LoginUser user);
    }
}