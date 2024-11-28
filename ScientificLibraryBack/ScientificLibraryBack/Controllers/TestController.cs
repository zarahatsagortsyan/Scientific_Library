using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ScientificLibraryBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Reader")]
    public class TestController : ControllerBase
    {
        [HttpGet]
        public string Get()
        {

            return "You hit me!";
        }
    }
}
