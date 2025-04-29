using Azure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScientificLibraryBack.DTO;
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

        [HttpGet("info/{id}")]
        public async Task<IActionResult> GetBookById(Guid id)
        {
            var book = await _bookService.GetBookByIdAsync(id);

            if (book == null)
            {
                return NotFound(book);
            }

            return Ok(book);
        }

        [HttpGet("allBooks")]
        public async Task<IActionResult> GetAllBooks()
        {
            var booksResponse = await _bookService.GetAllBooksAsync();

            if (!booksResponse.Success)
            {
                return NotFound(booksResponse);
            }

            return Ok(booksResponse);
        }

        [HttpGet("reviews/{id}")]
        public async Task<IActionResult> GetBookReviews(Guid id)
        {
            var book = await _bookService.GetReviewsForBookAsync(id);

            if (book == null)
            {
                return NotFound(book);
            }

            return Ok(book);
        }

        [HttpGet("genres")]
        public async Task<IActionResult> GetAllGenres()
        {
            var genreResponse = await _bookService.GetGenresAsync();

            if (!genreResponse.Success)
            {
                return NotFound(genreResponse);
            }

            return Ok(genreResponse);
        }

        [HttpGet("languages")]
        public async Task<IActionResult> GetAllLangauges()
        {
            var langResponse = await _bookService.GetLanguagesAsync();

            if (!langResponse.Success)
            {
                return NotFound(langResponse);
            }

            return Ok(langResponse);
        }

        [HttpGet("keywords")]
        public async Task<IActionResult> GetAllKeywords()
        {
            var keywordResponse = await _bookService.GetKeywordsAsync();

            if (!keywordResponse.Success)
            {
                return NotFound(keywordResponse);
            }

            return Ok(keywordResponse);
        }


        [HttpGet("open/{bookId}")]
        public async Task<IActionResult> OpenBookPdf(Guid bookId)
        {
            var book = await _bookService.GetBookPDF(bookId);
            if (book == null || book.Data == null)
            {
                return NotFound(new { success = false, message = "Book or PDF not found." });
            }

            var fileName = book.Data.pdfFileName ?? "book.pdf";
            var contentType = "application/pdf";

            return File(book.Data.pdfFile, contentType, fileName);
        }

        [HttpGet("download/{bookId}")]
        public async Task<IActionResult> DownloadBookPdf(Guid bookId)
        {
            var book = await _bookService.GetBookPDF(bookId);
            if (book == null || book.Data.pdfFile == null)
            {
                return NotFound(new { success = false, message = "Book or PDF not found." });
            }

            var fileName = book.Data.pdfFileName ?? "book.pdf";
            var contentType = "application/pdf";

            var contentDisposition = new System.Net.Mime.ContentDisposition
            {
                FileName = fileName,
                Inline = false  // This forces the browser to download the file
            };

            Response.Headers.Add("Content-Disposition", contentDisposition.ToString());
            return File(book.Data.pdfFile, contentType, fileName);
        }
        [HttpGet("cover/{id}")]
        public async Task<IActionResult> GetBookCoverImage(Guid id)
        {
            var book = await _bookService.GetBookCoverImage(id);
            if (book == null || book.Data == null || book.Data.Length == 0)
            {
                return NotFound("Image not found");
            }

            // Return image as a raw file with correct MIME type
            return File(book.Data, "image/jpeg");
        }

        [HttpGet("filter")]
        public async Task<IActionResult> FilterBooks([FromQuery] BookFilterRequest filter)
        {
            filter.Genres = Request.Query.ContainsKey("genres")
                ? Request.Query["genres"].ToString().Split(',', StringSplitOptions.RemoveEmptyEntries).Select(int.Parse).ToList()
                : new List<int>();

            filter.Languages = Request.Query.ContainsKey("languages")
                ? Request.Query["languages"].ToString().Split(',', StringSplitOptions.RemoveEmptyEntries).ToList()
                : new List<string>();

            filter.Keywords = Request.Query.ContainsKey("keywords")
                ? Request.Query["keywords"].ToString().Split(',', StringSplitOptions.RemoveEmptyEntries).ToList()
                : new List<string>();

            var result = await _bookService.FilterBooksAsync(filter);
            return result.Success ? Ok(result) : BadRequest(result);
        }

    }

}
