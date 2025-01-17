using Azure;
using Microsoft.AspNetCore.Mvc;
using ScientificLibraryBack.Models;
using ScientificLibraryBack.Models.DB;
using ScientificLibraryBack.Services.BookService;

namespace ScientificLibraryBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : Controller
    {
        private readonly IBookService _bookService;
        public BookController(IBookService bookService)
        {
            _bookService = bookService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBookById(Guid id)
        {
            var book = await _bookService.GetBookByIdAsync(id);

            if (book == null)
            {
                return NotFound(book);
            }

            return Ok(book);
        }

        //[HttpGet("books")]
        [HttpGet]
        public async Task<IActionResult> GetAllBooks()
        {
            var booksResponse = await _bookService.GetAllBooksAsync();

            if (!booksResponse.Success || booksResponse.Data == null || !booksResponse.Data.Any())
            {
                return NotFound(booksResponse);
            }

            return Ok(booksResponse);
        }

        [HttpGet("genres")]
        public async Task<IActionResult> GetAllGenres()
        {
            var genreResponse = await _bookService.GetGenresAsync();

            if (!genreResponse.Success || genreResponse.Data == null || !genreResponse.Data.Any())
            {
                return NotFound(genreResponse);
            }

            return Ok(genreResponse);
        }
    }

}
