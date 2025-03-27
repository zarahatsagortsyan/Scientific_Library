using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.IdentityModel.Tokens;
using ScientificLibraryBack.DTO;
using ScientificLibraryBack.Models.DB;
using ScientificLibraryBack.Services.EmailService;
using ScientificLibraryBack.Services.EmailService.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Web;
namespace ScientificLibraryBack.Services.AuthService
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ExtendedIdentityUser> _userManager;
        private readonly IConfiguration _config;
        private readonly IEmailService _emailService;

        public AuthService(UserManager<ExtendedIdentityUser> userManager, IConfiguration config, IEmailService emailService)
        {
            _userManager = userManager;
            _config = config;
            _emailService = emailService;

        }

        public string GenerateTokenString(ExtendedIdentityUser user)
        {
            var roles = GetUserRole(user.Email!); 

            if (roles == null || roles.Count() == 0)
            {
                throw new UnauthorizedAccessException("User has no roles assigned.");
            }

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email!),
            };

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role)); 
            }

            var staticKey = _config.GetSection("Jwt:Key").Value;
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(staticKey));
            var signingCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);

            var securityToken = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddHours(20),
                issuer: _config["JWT:Issuer"],
                audience: _config["JWT:Audience"],
                signingCredentials: signingCredentials
            );

            string tokenString = new JwtSecurityTokenHandler().WriteToken(securityToken);
            return tokenString;
        }

        public async Task<LoginResponse> Login(LoginUser user)
        {
            var response = new LoginResponse();
            var identityUser = await _userManager.FindByEmailAsync(user.Email);

            if (identityUser == null || !await _userManager.CheckPasswordAsync(identityUser, user.Password))
            {
                response.Errors = new ApiResponse<bool>
                {
                    Success = false,
                    Message = "Invalid email or password.",
                    Data = false
                };
                return response;
            }

            if (identityUser.Banned)
            {
                response.IsLogedIn = false;
                response.JwtToken = string.Empty;
                response.RefreshToken = string.Empty;
                response.Errors = new ApiResponse<bool>
                {
                    Success = false,
                    Message = "User is banned.",
                    Data = false
                };
                return response;
            }
            if (identityUser.EmailConfirmed == false)
            {
                response.IsLogedIn = false;
                response.JwtToken = string.Empty;
                response.RefreshToken = string.Empty;
                response.Errors = new ApiResponse<bool>
                {
                    Success = false,
                    Message = "User Email is not confirmed",
                    Data = false
                };
                return response;
            }

            response.IsLogedIn = true;
            response.JwtToken = GenerateTokenString(identityUser);
            response.RefreshToken = GenerateRefreshTokenString();

            identityUser.LastLoginDate = DateTime.UtcNow;
            identityUser.RefreshToken = response.RefreshToken;
            identityUser.RefreshTokenExpiryTime = DateTime.Now.AddHours(12);
            await _userManager.UpdateAsync(identityUser);

            return response;
        }
        private string GenerateRefreshTokenString()
        {
            var randomNumber = new byte[64];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);

                return Convert.ToBase64String(randomNumber);
            }
        }

        public async Task<ApiResponse<IdentityResult>> RegisterReader(RegisterReader user)
        {
            try
            {
                var existingUser = await _userManager.FindByEmailAsync(user.Email);

                // Check if email is already registered but not confirmed
                if (existingUser != null)
                {
                    if (!existingUser.EmailConfirmed)
                    {
                        var token = await _userManager.GenerateEmailConfirmationTokenAsync(existingUser);
                        var encodedToken = HttpUtility.UrlEncode(token);
                        var param = new Dictionary<string, string?>
                {
                    { "token", encodedToken },
                    { "email", user.Email }
                };

                        var callbackUrl = QueryHelpers.AddQueryString(user.ClientUri!, param);
                        var message = new EmailService.Models.Message([user.Email!], "Confirm your email", callbackUrl);
                        _emailService.SendEmail(message);

                        return new ApiResponse<IdentityResult>
                        {
                            Success = false,
                            Message = "This email is already registered but not confirmed. A new confirmation email has been sent.",
                            Data = null
                        };
                    }

                    return new ApiResponse<IdentityResult>
                    {
                        Success = false,
                        Message = "This email is already registered.",
                        Data = null
                    };
                }

                // Create new user since the email is not found
                var identityUser = new ExtendedIdentityUser
                {
                    UserName = user.Email,
                    Email = user.Email,
                    PhoneNumber = user.Phone,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    DateOfBirth = user.BirthDate,
                    Type = UserType.Reader,
                    IsActive = true,
                    CreatedAt = DateTime.Now,
                    Banned = false,
                    EmailConfirmed = false
                };

                var result = await _userManager.CreateAsync(identityUser, user.Password!);

                if (!result.Succeeded)
                {
                    return new ApiResponse<IdentityResult>
                    {
                        Success = false,
                        Message = "Registration failed.",
                        Data = result
                    };
                }

                // Add user to Reader role
                await _userManager.AddToRoleAsync(identityUser, "Reader");

                // Send confirmation email
                var newToken = await _userManager.GenerateEmailConfirmationTokenAsync(identityUser);
                var newEncodedToken = HttpUtility.UrlEncode(newToken);
                var newParam = new Dictionary<string, string?>
        {
            { "token", newEncodedToken },
            { "email", user.Email }
        };

                var newCallbackUrl = QueryHelpers.AddQueryString(user.ClientUri!, newParam);
                var newMessage = new EmailService.Models.Message([user.Email!], "Confirm your email", newCallbackUrl);
                _emailService.SendEmail(newMessage);

                return new ApiResponse<IdentityResult>
                {
                    Success = true,
                    Message = "Registration successful. Please check your email for verification.",
                    Data = result
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse<IdentityResult>
                {
                    Success = false,
                    Message = $"An error occurred: {ex.Message}",
                    Data = null
                };
            }
        }

        public IEnumerable<string>? GetUserRole(string userEmail)
        {
            var identityUser = _userManager.FindByEmailAsync(userEmail).Result; // Get the user synchronously
            if (identityUser == null)
            {
                return null; // Return null if user not found
            }

            return _userManager.GetRolesAsync(identityUser).Result; // Get roles synchronously
        }
        public async Task<ApiResponse<IdentityResult>> RegisterPublisher(RegisterPublisher user)
        {
            try
            {
                // Check if the email already exists
                var existingUser = await _userManager.FindByEmailAsync(user.Email);

                if (existingUser != null)
                {
                    if (!existingUser.EmailConfirmed)
                    {
                        // Resend confirmation email
                        var token = await _userManager.GenerateEmailConfirmationTokenAsync(existingUser);
                        var encodedToken = HttpUtility.UrlEncode(token);
                        var param = new Dictionary<string, string?>
                {
                    { "token", encodedToken },
                    { "email", user.Email }
                };

                        var callbackUrl = QueryHelpers.AddQueryString(user.ClientUri!, param);
                        var message = new EmailService.Models.Message([user.Email!], "Confirm your email", callbackUrl);
                        _emailService.SendEmail(message);

                        return new ApiResponse<IdentityResult>
                        {
                            Success = false,
                            Message = "This email is already registered but not confirmed. A new confirmation email has been sent.",
                            Data = null
                        };
                    }

                    return new ApiResponse<IdentityResult>
                    {
                        Success = false,
                        Message = "This email is already registered.",
                        Data = null
                    };
                }

                // Create new user if email is not found
                var identityUser = new ExtendedIdentityUser
                {
                    UserName = user.Email,
                    Email = user.Email,
                    PhoneNumber = user.Phone,
                    CompanyName = user.CompanyName,
                    DateOfBirth = user.EstablishDate,
                    Type = UserType.Publisher,
                    IsActive = true,
                    CreatedAt = DateTime.Now,
                    Banned = false,
                    EmailConfirmed = false
                };

                var result = await _userManager.CreateAsync(identityUser, user.Password!);

                if (!result.Succeeded)
                {
                    return new ApiResponse<IdentityResult>
                    {
                        Success = false,
                        Message = "Registration failed.",
                        Data = result
                    };
                }

                // Add user to Publisher role
                await _userManager.AddToRoleAsync(identityUser, "Publisher");

                // Send confirmation email
                var newToken = await _userManager.GenerateEmailConfirmationTokenAsync(identityUser);
                var newEncodedToken = HttpUtility.UrlEncode(newToken);
                var newParam = new Dictionary<string, string?>
        {
            { "token", newEncodedToken },
            { "email", user.Email }
        };

                var newCallbackUrl = QueryHelpers.AddQueryString(user.ClientUri!, newParam);
                var newMessage = new EmailService.Models.Message([user.Email!], "Confirm your email", newCallbackUrl);
                _emailService.SendEmail(newMessage);

                return new ApiResponse<IdentityResult>
                {
                    Success = true,
                    Message = "Registration successful. Please check your email for verification.",
                    Data = result
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse<IdentityResult>
                {
                    Success = false,
                    Message = $"An error occurred: {ex.Message}",
                    Data = null
                };
            }
        }


        public async Task<LoginResponse> RefreshToken(RefreshTokenModel model)
        {
            var principal = GetTokenPrincipal(model.JwtToken);

            var response = new LoginResponse();
            if (principal?.Identity?.Name is null)
                return response;

            var identityUser = await _userManager.FindByEmailAsync(principal.Identity.Name);

            if (identityUser is null || identityUser.RefreshToken != model.RefreshToken || identityUser.RefreshTokenExpiryTime < DateTime.Now)
                return response;

            response.IsLogedIn = true;
            //response.JwtToken = GenerateTokenString(identityUser.Email!);
            response.JwtToken = GenerateTokenString(identityUser!);
            response.RefreshToken = GenerateRefreshTokenString();


            identityUser.RefreshToken = response.RefreshToken;
            identityUser.RefreshTokenExpiryTime = DateTime.Now.AddHours(12);
            await _userManager.UpdateAsync(identityUser);

            return response;
        }
        private ClaimsPrincipal? GetTokenPrincipal(string token)
        {

            var jwtSettings = _config.GetSection("Jwt");

            var tokenValitationParameters = new TokenValidationParameters
            {
                ValidateActor = true,
                ValidateIssuer = true,
                ValidateAudience = true,
                RequireExpirationTime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtSettings["Issuer"],
                ValidAudience = jwtSettings["Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"])),
                RoleClaimType = ClaimTypes.Role // Make sure this is set correctly for role validation

            };

            return new JwtSecurityTokenHandler().ValidateToken(token, tokenValitationParameters, out _);
        }

        public async Task<LogoutResponse> Logout(string userEmail)
        {
            var user = await _userManager.FindByNameAsync(userEmail);
            var logoutResponse = new LogoutResponse();
            if (user != null)
            {
                try
                {
                    user.RefreshToken = null;
                    user.RefreshTokenExpiryTime = null;
                    await _userManager.UpdateAsync(user);
                    logoutResponse.code = 1;
                    logoutResponse.message = "ok";
                }
                catch (Exception ex)
                {
                    logoutResponse.code = 1;
                    logoutResponse.message = ex.Message;

                    return logoutResponse;
                }
            }
            return logoutResponse;
        }

        public async Task<ApiResponse<IdentityResult>> ResetPassword(Models.ResetPasswordRequest resetPassword)
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(resetPassword.Email!);
                if (user is null)
                {
                    return new ApiResponse<IdentityResult>
                    {
                        Success = false,
                        Message = $"Invalid Request",
                        Data = null
                    };
                }

                var result = await _userManager.ResetPasswordAsync(user, resetPassword.Token!, resetPassword.NewPassword!);

                return new ApiResponse<IdentityResult>
                {
                    Success = result.Succeeded,
                    Message = result.Succeeded ? "Password changed successfully." : "Password change failed.",
                    Data = result
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse<IdentityResult>
                {
                    Success = false,
                    Message = $"An error occurred: {ex.Message}",
                    Data = null
                };
            }
        }

    }
}
