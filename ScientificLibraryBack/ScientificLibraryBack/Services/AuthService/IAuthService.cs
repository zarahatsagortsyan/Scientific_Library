using Microsoft.AspNetCore.Identity;
using ScientificLibraryBack.Models;
using ScientificLibraryBack.Shared;

namespace ScientificLibraryBack.Services.AuthService
{
    public interface IAuthService
    {
        string GenerateTokenString(string userName);
        //Task<bool> Login(LoginUser user);
        Task<LoginResponse> Login(LoginUser user);
        Task<LoginResponse> RefreshToken(RefreshTokenModel model);
        Task<LogoutResponse> Logout(string userName);


        Task<bool> RegisterReader(LoginUser user);
        IEnumerable<string> GetUserRole(string userName);
        Task<IdentityResult> RegisterPublisher(LoginUser user);
        //Task<TokenDto> GenerateTokenString(bool populateExp);
    }
}