using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using ScientificLibraryBack.Models;
namespace ScientificLibraryBack.Services
{
    public class AuthService
    {
        private readonly UserManager<IdentityUser> _userManager;
        public AuthService(UserManager<IdentityUser> userManager) 
        {
            _userManager = userManager;
        }
        public async Task<bool> RegisterUser(LoginUser user)
        {
            var identityUser = new IdentityUser
            {
                UserName = user.UserName,
                Email = user.UserName


            };
        }
    }
}
