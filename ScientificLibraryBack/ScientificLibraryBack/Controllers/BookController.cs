using Microsoft.AspNetCore.Mvc;
using ScientificLibraryBack.Models.DB;
using ScientificLibraryBack.Services;

namespace ScientificLibraryBack.Controllers
{
    public class BookController : Controller
    {
        private readonly IBookService _bookService;
        public BookController(IBookService bookService)
        {
            _bookService = bookService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateBook(Book bookCreateRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _bookService.CreateBookAsync(bookCreateRequest);
            if (result.Success)
            {
                return CreatedAtAction(nameof(GetBookById), new { id = result.Data }, result);
            }

            return BadRequest("Error creating book");
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBookById(Guid id)
        {
            var book = await _bookService.GetBookByIdAsync(id);

            if (book == null)
            {
                return NotFound();
            }

            return Ok(book);
        }
    }
}
