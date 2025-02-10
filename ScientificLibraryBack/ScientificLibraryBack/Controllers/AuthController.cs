using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using ScientificLibraryBack.DTO;
using ScientificLibraryBack.Models;
using ScientificLibraryBack.Models.DB;
using ScientificLibraryBack.Services.AuthService;
using ScientificLibraryBack.Services.EmailService;
using ScientificLibraryBack.Services.EmailService.Models;
using System.ComponentModel.DataAnnotations;
using System.Security.Principal;
namespace ScientificLibraryBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly UserManager<ExtendedIdentityUser> _userManager;
        private readonly IEmailService _emailService;

        public AuthController(IAuthService authService, UserManager<ExtendedIdentityUser> userManager, IEmailService emailService)
        {
            _authService = authService;
            _userManager = userManager;
            _emailService = emailService;
        }

        [HttpPost("register/reader")]
        public async Task<ActionResult<ApiResponse<IdentityResult>>> RegisterReader([FromBody] RegisterUser user)
        {
            var response = await _authService.RegisterReader(user);

            if (response.Success)
            {
                return Ok(response);
            }

            return BadRequest(response);
        }


        [HttpPost("register/publisher")]
        public async Task<ActionResult<ApiResponse<IdentityResult>>> RegisterPublisher([FromBody] RegisterUser user)
        {

            var response = await _authService.RegisterPublisher(user);

            if (response.Success)
            {
                return Ok(response);
            }

            return BadRequest(response);
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
        public async Task<IActionResult> Logout(string userEmail)
        {
            try
            {
                var logoutResponse = await _authService.Logout(userEmail);

                if (logoutResponse is null || logoutResponse.code == 0)
                    return BadRequest();

                return Ok(logoutResponse);
            }
            catch (Exception excp)
            {
                return BadRequest(excp);
            }
        }


        [AllowAnonymous]
        [HttpPost("forgotpassword")]
        public async Task<IActionResult> ForgotPassword([FromBody] DTO.ForgotPasswordRequest forgotPassword)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.FindByEmailAsync(forgotPassword.Email!);
            if (user is null)
                return BadRequest(ModelState);

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var param = new Dictionary<string, string?>
            {
                { "token", token},
                { "email", forgotPassword.Email!}
            };

            var callback = QueryHelpers.AddQueryString(forgotPassword.ClientUri!, param);
            var message = new Message([user.Email!], "Reset password link", callback!);

            _emailService.SendEmail(message);
            return Ok();
        }

        [HttpPost("resetpassword")]
        public async Task<IActionResult> ResetPassword([FromBody] Models.ResetPasswordRequest resetPassword)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var response = await _authService.ResetPassword(resetPassword);

            if (response.Success)
            {
                return Ok(response);
            }

            return BadRequest(response);
            //var user = await _userManager.FindByEmailAsync(resetPassword.Email!);
            //if (user is null)
            //    return BadRequest("Invalid Request");
            //var result = await _userManager.ResetPasswordAsync(user, resetPassword.Token!, resetPassword.NewPassword!);

            //if (!result.Succeeded)
            //{
            //    var errors = result.Errors.Select(e => e.Description);

            //    return BadRequest(errors);
            //}
            //return Ok();
        }
    }
}
