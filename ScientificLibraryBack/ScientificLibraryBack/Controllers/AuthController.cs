using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using ScientificLibraryBack.Models;
using ScientificLibraryBack.Services;
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
        public async Task<IActionResult> RegisterPublisher(LoginUser user)
        {
            if (await _authService.RegisterPublisher(user))
            {
                return Ok("Successfuly done");
            }
            return BadRequest("Something went wrong");
        }


        [HttpPost("RefreshToken")]
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

    }
}
