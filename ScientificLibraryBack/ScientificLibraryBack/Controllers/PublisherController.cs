using Microsoft.AspNetCore.Mvc;
using ScientificLibraryBack.DTO;
using ScientificLibraryBack.Services.PublisherService;

namespace ScientificLibraryBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PublisherController : Controller
    {
        private readonly IPublisherService _publisherService;
        public PublisherController(IPublisherService publisherService)
        {
            _publisherService = publisherService;
        }


        [HttpGet("GetBook/{id}")]
        public async Task<IActionResult> GetBookById(Guid id)
        {
            var book = await _publisherService.GetBookByIdAsync(id);

            if (book == null)
            {
                return NotFound(book);
            }

            return Ok(book);
        }
        [HttpPost("CreateBook")]
        public async Task<IActionResult> CreateBook([FromBody] BookCreateRequest bookCreateRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _publisherService.CreateBookAsync(bookCreateRequest);
            if (result.Success)
            {
                return CreatedAtAction(nameof(GetBookById), new { id = result.Data }, result);
            }

            return BadRequest(result.Message);
        }

        [HttpPost("UpdateBook/{id}")]
        public async Task<IActionResult> UpdateBookById(Guid Id, BookCreateRequest updateRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var updateRespone = await _publisherService.UpdateBookAsync(Id, updateRequest);

            if (!updateRespone.Success)
            {
                return NotFound(updateRespone);
            }

            return Ok(updateRespone);
        }

        [HttpGet("GetMyPublishedBooks/{publisherId}")]
        public async Task<IActionResult> GetMyPublishedBooks(string publisherId)
        {
            var books = await _publisherService.GetPublishedBooksAsync(publisherId);

            if (books == null)
            {
                return NotFound(books);
            }

            return Ok(books);
        }

        [HttpGet("GetPendingBooks")]
        public async Task<IActionResult> GetPendingBooks(string publisherId)
        {
            var books = await _publisherService.GetPendingBooksAsync(publisherId);

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
            var books = await _publisherService.GetRejectedBooksAsync(publisherId);

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

    }
}
