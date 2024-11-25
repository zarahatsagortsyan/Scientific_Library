using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using ScientificLibraryBack.Models;
namespace ScientificLibraryBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        [HttpPost]
        public async Task<bool> RegisterUser(LoginUser user)
        {
            var identityUser = new IdentityUser
            {
                UserName = user.UserName,
                Email = user.UserName

            };

            var result  = await _userManager.CreateAsync(identityUser, user.Password);
            return result.Succeeded;
        }

        [HttpGet]
        public async Task Login(LoginUser loginModel)
        { 
        
        }
    }
}
