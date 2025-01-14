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

        [HttpGet("GetBook/{id}")]
        public async Task<IActionResult> GetBookById(Guid id)
        {
            var book = await _bookService.GetBookByIdAsync(id);

            if (book == null)
            {
                return NotFound(book);
            }

            return Ok(book);
        }

        [HttpGet("GetAllBooks")]
        public async Task<IActionResult> GetAllBooks()
        {
            var books = await _bookService.GetAllBooksAsync();

            if (books == null)
            {
                return NotFound(books);
            }

            return Ok(books);
        }
    }
}
