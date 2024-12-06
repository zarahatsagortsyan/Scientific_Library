using Microsoft.AspNetCore.Mvc;
using ScientificLibraryBack.Models;
using ScientificLibraryBack.Models.DB;
using ScientificLibraryBack.Services.BookService;

namespace ScientificLibraryBack.Controllers
{
    public class BookController : Controller
    {
        private readonly IBookService _bookService;
        public BookController(IBookService bookService)
        {
            _bookService = bookService;
        }

        [HttpPost("CreateBook")]
        public async Task<IActionResult> CreateBook([FromBody] BookCreateRequest bookCreateRequest)
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

            return BadRequest(result.Message);
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

        [HttpPost("UpdateBook/{id}")]
        public async Task<IActionResult> UpdateBookById(Guid Id, BookCreateRequest updateRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var updateRespone = await _bookService.UpdateBookAsync(Id, updateRequest);

            if (!updateRespone.Success)
            {
                return NotFound(updateRespone);
            }

            return Ok(updateRespone);
        }


        [HttpGet("GetMyPublishedBooks/{publisherId}")]
        public async Task<IActionResult> GetMyPublishedBooks(string publisherId)
        {
            var books = await _bookService.GetPublishedBooksAsync(publisherId);

            if (books == null)
            {
                return NotFound(books);
            }

            return Ok(books);
        }

        [HttpGet("GetPendingBooks/{publisherId}")]
        public async Task<IActionResult> GetPendingBooks(string publisherId)
        {
            var books = await _bookService.GetPendingBooksAsync(publisherId);

            if (books == null)
            {
                return NotFound(books);
            }

            return Ok(books);
        }

        // public async Task<IEnumerable<Book>> GetRejectedBooksAsync(Guid publisherId)


        [HttpGet("GetRejectedBooks/{publisherId}")]
        public async Task<IActionResult> GetRejectedBooks(string publisherId)
        {
            var books = await _bookService.GetRejectedBooksAsync(publisherId);

            if (books == null)
            {
                return NotFound(books);
            }

            return Ok(books);
        }


        [HttpPost("ChangeBookAvailability")]
        public async Task<IActionResult> ChangeBookAvailability([FromBody] BookChangeAvailabilityRequest bookChangeAvailability)
        {

            return Ok();
        
        }

        [HttpPost("ApproveBook/{bookId}")]
        public async Task<IActionResult> ApproveBook(Guid bookId)
        {
            var respone = await  _bookService.ApproveBook(bookId);

            if (respone.Success)
            {
                return Ok(respone);
            }

            return BadRequest(respone);
        }


        [HttpPost("RejectBook/{bookId}")]
        public async Task<IActionResult> RejectBook(Guid bookId)
        {
            var respone = await _bookService.RejectBook(bookId);

            if (respone.Success)
            {
                return Ok(respone);
            }

            return BadRequest(respone);
        }
    }
}
