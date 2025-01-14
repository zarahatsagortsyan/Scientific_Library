using Microsoft.AspNetCore.Mvc;
using ScientificLibraryBack.DTO;
using ScientificLibraryBack.Models.DB;
using ScientificLibraryBack.Services.BookService;

namespace ScientificLibraryBack.Controllers
{
    public class ReaderController : Controller
    {
        private readonly IReaderService _readerService;
        public ReaderController(IReaderService readerService)
        {
            _readerService = readerService;
        }


        [HttpPost("AddBookToUserList")]
        public async Task<IActionResult> AddBookToToReadList([FromBody] UserBookRequest request)
        {
            var response = await _readerService.AddBookToUserListAsync(request.BookId, request.UserId, request.ReadingStatus);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }


        [HttpPost("RemoveBookFromUserList")]
        public async Task<IActionResult> RemoveBookFromUserList([FromBody] UserBookRequest request)
        {
            var response = await _readerService.RemoveBookFromUserList( request.UserId,request.BookId);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }


        [HttpPost("UpdateBookReadingStatus")]
        public async Task<IActionResult> UpdateBookReadingStatus([FromBody] UserBookRequest request)
        {
            var response = await _readerService.UpdateReadingStatusAsync( request.BookId, request.UserId, request.ReadingStatus);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }

       // [HttpGet("GetUserBookList")]


    }
}
