using Azure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        //[HttpGet("books")]
        [HttpGet("allBooks")]
        public async Task<IActionResult> GetAllBooks()
        {
            var booksResponse = await _bookService.GetAllBooksAsync();

            if (!booksResponse.Success || booksResponse.Data == null || !booksResponse.Data.Any())
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

            if (!genreResponse.Success || genreResponse.Data == null || !genreResponse.Data.Any())
            {
                return NotFound(genreResponse);
            }

            return Ok(genreResponse);
        }

        [HttpGet("open/{bookId}")]
        public async Task<IActionResult> OpenBookPdf(Guid bookId)
        {
            var book = await _bookService.GetBookByIdAsync(bookId);
            if (book == null || book.Data.PdfFile == null)
            {
                return NotFound(new { success = false, message = "Book or PDF not found." });
            }

            var fileName = book.Data.PdfFileName ?? "book.pdf";
            var contentType = "application/pdf";

            return File(book.Data.PdfFile, contentType, fileName);
        }

        [HttpGet("download/{bookId}")]
        public async Task<IActionResult> DownloadBookPdf(Guid bookId)
        {
            var book = await _bookService.GetBookByIdAsync(bookId);
            if (book == null || book.Data.PdfFile == null)
            {
                return NotFound(new { success = false, message = "Book or PDF not found." });
            }

            var fileName = book.Data.PdfFileName ?? "book.pdf";
            var contentType = "application/pdf";

            var contentDisposition = new System.Net.Mime.ContentDisposition
            {
                FileName = fileName,
                Inline = false  // This forces the browser to download the file
            };

            Response.Headers.Add("Content-Disposition", contentDisposition.ToString());
            return File(book.Data.PdfFile, contentType, fileName);
        }
        [HttpGet("cover/{id}")]
        public async Task<IActionResult> GetBookCoverImage(Guid id)
        {
            var book = await _bookService.GetBookByIdAsync(id);
            if (book == null || book.Data.CoverImage == null)
            {
                return NotFound("Image not found");
            }

            // Return image as a file
            return File(book.Data.CoverImage, "image/jpeg");
        }
    }

}
