using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.IdentityModel.Tokens;
using ScientificLibraryBack.Models;
using ScientificLibraryBack.Models.DB;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
namespace ScientificLibraryBack.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IConfiguration _config;

        public AuthService(UserManager<IdentityUser> userManager, IConfiguration config)
        {
            _userManager = userManager;
            _config = config;
        }

        public string GenerateTokenString(LoginUser user)
        {
            var roles = GetUserRole(user); // Call the synchronous method to get roles

            if (roles == null || roles.Count() == 0)
            {
                throw new UnauthorizedAccessException("User has no roles assigned.");
            }

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.UserName),
            };

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role)); // Add each role to the claims
            }

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWT:Key"]));
            var signingCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);

            var securityToken = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddMinutes(60),
                issuer: _config["JWT:Issuer"],
                audience: _config["JWT:Audience"],
                signingCredentials: signingCredentials
            );

            return new JwtSecurityTokenHandler().WriteToken(securityToken); // Return the token string
        }


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

        public async Task<bool> Login(LoginUser user)
        {
            var identityUser = await _userManager.FindByEmailAsync(user.UserName);


            if (identityUser == null)
            {
                return false;
            }

            return await _userManager.CheckPasswordAsync(identityUser, user.Password);
        }

        public async Task<bool> RegisterReader(LoginUser user)
        {
            var identityUser = new IdentityUser
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
        public IEnumerable<string> GetUserRole(LoginUser user)
        {
            var identityUser = _userManager.FindByEmailAsync(user.UserName).Result; // Get the user synchronously
            if (identityUser == null)
            {
                return null; // Return null if user not found
            }

            return _userManager.GetRolesAsync(identityUser).Result; // Get roles synchronously
        }


    }
}
