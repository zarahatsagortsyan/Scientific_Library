using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ScientificLibraryBack.DTO;
using ScientificLibraryBack.Services.PublisherService;
using System.Security.Claims;

namespace ScientificLibraryBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles ="Publisher")]
    public class PublisherController : Controller
    {
        private readonly IPublisherService _publisherService;
        public PublisherController(IPublisherService publisherService)
        {
            _publisherService = publisherService;
        }

        [HttpGet("books/{id}")]
        public async Task<IActionResult> GetBookById(Guid id)
        {
            var book = await _publisherService.GetBookByIdAsync(id);

            if (book == null)
            {
                return NotFound(book);
            }

            return Ok(book);
        }

        [HttpPost("books")]
        public async Task<IActionResult> CreateBook([FromBody] BookCreateRequest bookCreateRequest)
        {
            var publisherId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value; // Extract ID from claims
            if (string.IsNullOrEmpty(publisherId))
                return Unauthorized("Invalid publisher identity.");

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            bookCreateRequest.PublisherId = publisherId;
            var result = await _publisherService.CreateBookAsync(bookCreateRequest);
            if (result.Success)
            {
                return CreatedAtAction(nameof(GetBookById), new { id = result.Data }, result);
            }

            return BadRequest(result);
        }

        [HttpPatch("books/{id}")]
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

        [HttpGet("{publisherId}/books")]
        public async Task<IActionResult> GetMyPublishedBooks(string publisherId)
        {
            var books = await _publisherService.GetPublishedBooksAsync(publisherId);

            if (books == null)
            {
                return NotFound(books);
            }

            return Ok(books);
        }

        [HttpGet("books/pending")]
        public async Task<IActionResult> GetPendingBooks(string publisherId)
        {
            var books = await _publisherService.GetPendingBooksAsync(publisherId);

            if (books == null)
            {
                return NotFound(books);
            }

            return Ok(books);
        }

        [HttpGet("{publisherId}/books/rejected")]
        public async Task<IActionResult> GetRejectedBooks(string publisherId)
        {
            var books = await _publisherService.GetRejectedBooksAsync(publisherId);

            if (books == null)
            {
                return NotFound(books);
            }

            return Ok(books);
        }

        [HttpPatch("books/availability")]
        public async Task<IActionResult> ChangeBookAvailability([FromBody] BookChangeAvailabilityRequest bookChangeAvailability)
        {
            return Ok();
        }
    }
}
