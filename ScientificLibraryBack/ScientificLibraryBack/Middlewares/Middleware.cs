//using Microsoft.AspNetCore.Builder;
//using Microsoft.AspNetCore.Http;
//using System.IdentityModel.Tokens.Jwt;
//using System.Threading.Tasks;

//namespace ScientificLibraryBack.Middlewares
//{
//    public class TokenExpiryMiddleware
//    {
//        private readonly RequestDelegate _next;

//        public TokenExpiryMiddleware(RequestDelegate next)
//        {
//            _next = next;
//        }

//        public async Task Invoke(HttpContext context)
//        {
//            var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();

//            if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
//            {
//                var token = authHeader.Substring("Bearer ".Length).Trim();

//                var handler = new JwtSecurityTokenHandler();
//                if (handler.CanReadToken(token))
//                {
//                    var jwt = handler.ReadJwtToken(token);
//                    var exp = jwt.Claims.FirstOrDefault(c => c.Type == "exp")?.Value;

//                    if (exp != null && long.TryParse(exp, out long expirySeconds))
//                    {
//                        var expiryDate = DateTimeOffset.FromUnixTimeSeconds(expirySeconds).UtcDateTime;
//                        if (expiryDate < DateTime.UtcNow)
//                        {
//                            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
//                            await context.Response.WriteAsync("JWT expired");
//                            return; // Prevent request from reaching controller
//                        }
//                    }
//                }
//            }

//            await _next(context); // Continue to controller
//        }
//    }
//}
