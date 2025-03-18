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
using System.Web;
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
        public async Task<ActionResult<ApiResponse<IdentityResult>>> RegisterReader([FromBody] RegisterReader user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var response = await _authService.RegisterReader(user);

            if (response.Success)
            {
                return Ok(response);
            }

            return BadRequest(response);
        }


        [HttpPost("register/publisher")]
        public async Task<ActionResult<ApiResponse<IdentityResult>>> RegisterPublisher([FromBody] RegisterPublisher user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

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

                return Unauthorized(loginResult);
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
            var message = new Services.EmailService.Models.Message([user.Email!], "Reset password link", callback!);

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

        [AllowAnonymous]
        [HttpPost("confirm-email")]
        public async Task<IActionResult> ConfirmEmail([FromBody] ConfirmEmailRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Token))
                return BadRequest(new ApiResponse<string> { Success = false, Message = "Invalid email or token." });

            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
                return BadRequest(new ApiResponse<string> { Success = false, Message = "Invalid email or token." });

            var decodedToken = HttpUtility.UrlDecode(request.Token); //  Decode the token before usage
            var result = await _userManager.ConfirmEmailAsync(user, decodedToken);

            if (result.Succeeded)
                return Ok(new ApiResponse<string> { Success = true, Message = "Email confirmed successfully." });

            return BadRequest(new ApiResponse<string> { Success = false, Message = "Email confirmation failed." });
        }

        [HttpPost("resend-confirmation")]
        public async Task<IActionResult> ResendConfirmation([FromBody] ResendEmailRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);

            if (user == null || user.EmailConfirmed)
            {
                return BadRequest(new ApiResponse<bool>
                {
                    Success = false,
                    Message = "Email not found or already confirmed.",
                    Data = false
                });
            }

            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var encodedToken = HttpUtility.UrlEncode(token);
            var param = new Dictionary<string, string?>
    {
        { "token", encodedToken },
        { "email", request.Email }
    };

            var callbackUrl = QueryHelpers.AddQueryString(request.ClientUri!, param);
            var message = new Services.EmailService.Models.Message([request.Email!], "Confirm your email", callbackUrl);
            _emailService.SendEmail(message);

            return Ok(new ApiResponse<bool>
            {
                Success = true,
                Message = "A new confirmation email has been sent.",
                Data = true
            });
        }

    }
}
