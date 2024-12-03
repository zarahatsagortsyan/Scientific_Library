using Microsoft.AspNetCore.Http.Metadata;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.IdentityModel.Tokens;
using ScientificLibraryBack.Models;
using ScientificLibraryBack.Models.DB;
using ScientificLibraryBack.Shared;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Model;
namespace ScientificLibraryBack.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ExtendedIdentityUser> _userManager;
        private readonly IConfiguration _config;

        public AuthService(UserManager<ExtendedIdentityUser> userManager, IConfiguration config)
        {
            _userManager = userManager;
            _config = config;
        }

        public string GenerateTokenString(string userName)
        {
            var roles = GetUserRole(userName); // Call the synchronous method to get roles

            if (roles == null || roles.Count() == 0)
            {
                throw new UnauthorizedAccessException("User has no roles assigned.");
            }

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, userName),
            };

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role)); // Add each role to the claims
            }

            var staticKey = _config.GetSection("Jwt:Key").Value;
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(staticKey));
            var signingCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);

            var securityToken = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddMinutes(60),
                issuer: _config["JWT:Issuer"],
                audience: _config["JWT:Audience"],
                signingCredentials: signingCredentials
            );

            string tokenString = new JwtSecurityTokenHandler().WriteToken(securityToken);
            return tokenString;
        }

        //private string GenerateRefreshToken()
        //{
        //    var randomNumber = new byte[32];
        //    using (var rng = RandomNumberGenerator.Create())
        //    {
        //        rng.GetBytes(randomNumber);

        //        return Convert.ToBase64String(randomNumber);
        //    }

        //}

        //private ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
        //{
        //    var jwtSettings = _config.GetSection("Jwt");

        //    var tokenValitationParameters = new TokenValidationParameters
        //    {
        //        ValidateActor = true,
        //        ValidateIssuer = true,
        //        ValidateAudience = true,
        //        RequireExpirationTime = true,
        //        ValidateIssuerSigningKey = true,
        //        ValidIssuer = jwtSettings["Issuer"],
        //        ValidAudience = jwtSettings["Audience"],
        //        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"])),
        //        RoleClaimType = ClaimTypes.Role // Make sure this is set correctly for role validation

        //    };

        //    var tokenHandler = new JwtSecurityTokenHandler();
        //    SecurityToken securityToken;
        //    var principal = tokenHandler.ValidateToken(token, tokenValitationParameters, out securityToken);

        //    var jwtSecurityToken = securityToken as JwtSecurityToken;

        //    if (jwtSecurityToken is null || !jwtSecurityToken.Header.Alg
        //        .Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
        //    {
        //        throw new InvalidOperationException("Invalid Token");
        //    }
        //    return principal;
        //}


        //public string GenerateTokenString(LoginUser user)
        //{
        //    IEnumerable<System.Security.Claims.Claim> claims = new List<Claim>
        //    {
        //        new Claim(ClaimTypes.Email, user.UserName),
        //        new Claim(ClaimTypes.Role, "Admin"),

        //    };

        //    SecurityKey securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("JWT:Key").Value));
        //    SigningCredentials signingCred = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);

        //    var securityToken = new JwtSecurityToken(
        //        claims: claims,
        //        expires: DateTime.Now.AddMinutes(60),
        //        issuer: _config.GetSection("JWT:Issuer").Value,
        //        audience: _config.GetSection("JWT:Audience").Value,
        //        signingCredentials: signingCred

        //        );

        //    string tokenString = new JwtSecurityTokenHandler().WriteToken(securityToken);
        //    return tokenString;
        //}

        //public async Task<bool> Login(LoginUser user)
        //{
        //    var identityUser = await _userManager.FindByEmailAsync(user.UserName);


        //    if (identityUser == null)
        //    {
        //        return false;
        //    }

        //    return await _userManager.CheckPasswordAsync(identityUser, user.Password);
        //}

        public async Task<LoginResponse> Login(LoginUser user)
        {
            var response = new LoginResponse();
            var identityUser = await _userManager.FindByEmailAsync(user.UserName);


            if (identityUser == null || await _userManager.CheckPasswordAsync(identityUser, user.Password) == false)
            {
                return response;
            }

            response.IsLogedIn = true;
            response.JwtToken = this.GenerateTokenString(identityUser.Email);
            response.RefreshToken = this.GenerateRefreshTokenString();


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

        public async Task<bool> RegisterReader(LoginUser user)
        {
            var identityUser = new ExtendedIdentityUser
            {
                UserName = user.UserName,
                Email = user.UserName,
            };

            var result = await _userManager.CreateAsync(identityUser, user.Password);
            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(identityUser, "Reader"); // Example role assignment
            }
            Console.WriteLine(result.Errors);
            return result.Succeeded;
        }
        public IEnumerable<string>? GetUserRole(string userName)
        {
            var identityUser = _userManager.FindByEmailAsync(userName).Result; // Get the user synchronously
            if (identityUser == null)
            {
                return null; // Return null if user not found
            }

            return _userManager.GetRolesAsync(identityUser).Result; // Get roles synchronously
        }

        public async Task<bool> RegisterPublisher(LoginUser user)
        {
            var identityUser = new ExtendedIdentityUser
            {
                UserName = user.UserName,
                Email = user.UserName,
            };

            var result = await _userManager.CreateAsync(identityUser, user.Password);
            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(identityUser, "Publisher"); // Example role assignment
            }
            Console.WriteLine(result.Errors);
            return result.Succeeded;
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
            response.JwtToken = this.GenerateTokenString(identityUser.Email);
            response.RefreshToken = this.GenerateRefreshTokenString();


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
    }
}
