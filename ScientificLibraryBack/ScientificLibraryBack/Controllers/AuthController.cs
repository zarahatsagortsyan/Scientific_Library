using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using ScientificLibraryBack.Models;
using ScientificLibraryBack.Services.AuthService;
using System.Security.Principal;
namespace ScientificLibraryBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }
        [HttpPost("register/reader")]
        public async Task<IActionResult> RegisterReader(LoginUser user)
        {
            if (await _authService.RegisterReader(user))
            {
                return Ok("Successfuly done");
            }
            return BadRequest("Something went wrong");
        }

        [HttpPost("register/publisher")]
        public async Task<IdentityResult> RegisterPublisher(LoginUser user)
        {

                return await _authService.RegisterPublisher(user);
            
            //return BadRequest("Something went wrong");
        }


        [HttpPost("refreshToken")]
        public async Task<IActionResult> RefreshToken(RefreshTokenModel model)
        {
            var loginResult = await _authService.RefreshToken(model);
            if (loginResult.IsLogedIn)
            {
                return Ok(loginResult);
            }
            return Unauthorized();
        }

        //[HttpPost("login")]
        //public async Task<IActionResult> Login(LoginUser user)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest();
        //    }
        //    if (await _authService.Login(user))
        //    {
        //        var tokenString = _authService.GenerateTokenString(user);
        //        return Ok(tokenString);
        //    }
        //    return BadRequest();
        //}

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginUser user)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest();
                }

                var loginResult = await _authService.Login(user);
                if (loginResult.IsLogedIn)
                {
                    return Ok(loginResult);
                }

                return Unauthorized();
            }
            catch (Exception excp)
            {
                return BadRequest(excp);
            }
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout(string userName)
        {
            try
            {
                var logoutResponse = await _authService.Logout(userName);

                if (logoutResponse is null || logoutResponse.code == 0)
                    return BadRequest();

                return Ok(logoutResponse);
            }
            catch (Exception excp)
            {
                return BadRequest(excp);
            }
        }
    }
}
