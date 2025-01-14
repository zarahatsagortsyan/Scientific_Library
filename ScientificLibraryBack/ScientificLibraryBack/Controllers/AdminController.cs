using Microsoft.AspNetCore.Mvc;
using ScientificLibraryBack.Services.AdminService;

namespace ScientificLibraryBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : Controller
    {
        private readonly IAdminService _adminService;
        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpPost("ApproveBook/{bookId}")]
        public async Task<IActionResult> ApproveBook(Guid bookId)
        {
            var respone = await _adminService.ApproveBook(bookId);

            if (respone.Success)
            {
                return Ok(respone);
            }

            return BadRequest(respone);
        }


        [HttpPost("RejectBook/{bookId}")]
        public async Task<IActionResult> RejectBook(Guid bookId)
        {
            var respone = await _adminService.RejectBook(bookId);

            if (respone.Success)
            {
                return Ok(respone);
            }

            return BadRequest(respone);
        }
    }
}
