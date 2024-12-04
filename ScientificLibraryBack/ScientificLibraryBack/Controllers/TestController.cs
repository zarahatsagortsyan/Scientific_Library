using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

namespace ScientificLibraryBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
//    [Authorize(Roles = "Reader")]
    public class TestController : ControllerBase
    {
        [HttpGet]
        public string Get()
        {

            return "You hit me!";
        }

        [HttpGet("AuthorizedTest")]
        [Authorize]
        public IActionResult AuthorizedTest()
        {
            var authorizationHeader = this.HttpContext.Request.Headers["Authorization"].FirstOrDefault();

            string jwtTokenString = authorizationHeader.Replace("Bearer ", "");

            var jwt = new JwtSecurityToken(jwtTokenString);

            var response = $"Authenticated!{Environment.NewLine}";

            response += $"{Environment.NewLine}Exp Time: {jwt.ValidTo.ToLongTimeString()}, Time: {DateTime.UtcNow.ToLongTimeString()}";

            return Ok(response);
        }

    }
}
