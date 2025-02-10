using Microsoft.AspNetCore.Identity;
using ScientificLibraryBack.DTO;
using ScientificLibraryBack.Models.DB;
using ScientificLibraryBack.Shared;

namespace ScientificLibraryBack.Services.AuthService
{
    public interface IAuthService
    {
        //string GenerateTokenString(string userName);
        string GenerateTokenString(ExtendedIdentityUser user);

        //Task<bool> Login(LoginUser user);
        Task<LoginResponse> Login(LoginUser user);
        Task<LoginResponse> RefreshToken(RefreshTokenModel model);
        Task<LogoutResponse> Logout(string userEmail);


        Task<ApiResponse<IdentityResult>> RegisterReader(RegisterUser user);
        Task<ApiResponse<IdentityResult>> RegisterPublisher(RegisterUser user);
        IEnumerable<string> GetUserRole(string userEmail);
        Task<ApiResponse<IdentityResult>> ResetPassword(Models.ResetPasswordRequest resetPassword); // Reset Password method
        //Task<TokenDto> GenerateTokenString(bool populateExp);
    }
}