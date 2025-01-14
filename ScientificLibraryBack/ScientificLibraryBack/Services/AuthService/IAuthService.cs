using Microsoft.AspNetCore.Identity;
using ScientificLibraryBack.DTO;
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


        Task<IdentityResult> RegisterReader(LoginUser user);
        IEnumerable<string> GetUserRole(string userName);
        Task<IdentityResult> RegisterPublisher(LoginUser user);
        Task<IdentityResult> ResetPassword(string userName, string newPassword, string token); // Reset Password method
        //Task<TokenDto> GenerateTokenString(bool populateExp);
    }
}