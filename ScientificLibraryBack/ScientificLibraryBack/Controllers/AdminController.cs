using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ScientificLibraryBack.DTO;
using ScientificLibraryBack.Services.AdminService;

namespace ScientificLibraryBack.Controllers
{
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    [ApiController]
    public class AdminController : Controller
    {
        private readonly IAdminService _adminService;
        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpPatch("books/{bookId}/approve")]
        public async Task<IActionResult> ApproveBook(Guid bookId)
        {
            var respone = await _adminService.ApproveBook(bookId);

            if (respone.Success)
            {
                return Ok(respone);
            }

            return BadRequest(respone);
        }


        [HttpPatch("books/{bookId}/reject")]
        public async Task<IActionResult> RejectBook(Guid bookId)
        {
            var respone = await _adminService.RejectBook(bookId);

            if (respone.Success)
            {
                return Ok(respone);
            }

            return BadRequest(respone);
        }

        [HttpPost("genres")]
        public async Task<IActionResult> CreateGenre(CreateGenreRequest genreRequest)
        {
            var respone = await _adminService.CreateGenre(genreRequest);

            if (respone.Success)
            {
                return Ok(respone);
            }

            return BadRequest(respone);
        }

        [HttpDelete("genres/{id}")]
        public async Task<IActionResult> DeleteGenre(int id)
        {
            var respone = await _adminService.DeleteGenre(id);

            if (respone.Success)
            {
                return Ok(respone);
            }

            return BadRequest(respone);
        }

        [HttpPatch("genres/{id}")]
        public async Task<IActionResult> UpdateGenre(int id, UpdateGenreRequest updateGenre)
        {
            updateGenre.genreId = id;

            var respone = await _adminService.UpdateGenre(updateGenre);

            if (respone.Success)
            {
                return Ok(respone);
            }

            return BadRequest(respone);
        }

        [HttpGet("books/pending")]
        public async Task<IActionResult> GetPendingBooks()
        {
            var books = await _adminService.GetPendingBooks();

            if (books == null)
            {
                return NotFound(books);
            }

            return Ok(books);
        }

    }
}
