﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ScientificLibraryBack.DTO;
using ScientificLibraryBack.Models.DB;
using ScientificLibraryBack.Services.BookService;
using System.Security.Claims;

namespace ScientificLibraryBack.Controllers
{
    [Route("api/[controller]")]
    [Authorize(Roles = "Reader")]
    [ApiController]
    public class ReaderController : Controller
    {
        private readonly IReaderService _readerService;
        public ReaderController(IReaderService readerService)
        {
            _readerService = readerService;
        }

        // Add a book to the user's reading list
        [HttpPost("user-books")]
        public async Task<IActionResult> AddBookToUserList([FromBody] UserBookRequest request)
        {
            var response = await _readerService.AddBookToUserListAsync(request.BookId, request.UserId, request.ReadingStatus);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }

        // Remove a book from the user's reading list
        [HttpDelete("user-books")]
        public async Task<IActionResult> RemoveBookFromUserList([FromBody] UserBookRemoveRequest request)
        {
            var response = await _readerService.RemoveBookFromUserList(request.UserId, request.BookId);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }

        // Update the reading status of a book in the user's list
        [HttpPatch("user-books/status")]
        public async Task<IActionResult> UpdateBookReadingStatus([FromBody] UserBookRequest request)
        {
            var response = await _readerService.UpdateReadingStatusAsync(request.BookId, request.UserId, request.ReadingStatus);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        // Get all books for a user, filtered by reading status
        [HttpGet("user-books/{userId}")]
        public async Task<IActionResult> GetUserBooksAsync(string userId, [FromQuery] ReadingStatus? status = null)
        {
            var response = await _readerService.GetUserBooksAsync(userId, status);

            if (!response.Success)
            {
                return NotFound(response);  // Return not found if no books are retrieved
            }

            return Ok(response);  // Return the books
        }

        // Add a review for a book
        [HttpPost("reviews")]
        public async Task<IActionResult> AddReviewAsync([FromBody] ReviewRequest request)
        {
            var response = await _readerService.AddReviewAsync(request.UserId, request.BookId, request.ReviewText, request.Rating);

            if (!response.Success)
            {
                return BadRequest(response);  // Return bad request if the review cannot be added
            }

            return Ok(response);  // Return the added review details
        }

        // Delete a review for a book
        [HttpDelete("delete-review/{reviewId}")]
        public async Task<IActionResult> DeleteReviewAsync(string userId, Guid reviewId)
        {
            var response = await _readerService.DeleteReviewAsync(userId, reviewId);

            if (!response.Success)
            {
                return BadRequest(response);  // Return bad request if the review cannot be deleted
            }

            return Ok(response);  // Return success response
        }

        // Get all reviews by the user
        [HttpGet("user-reviews/{userId}")]
        public async Task<IActionResult> GetUserReviewedBooksAsync(string userId)
        {
            var response = await _readerService.GetUserReviewedBooksAsync(userId);

            if (!response.Success || response.Data == null || !response.Data.Any())
            {
                return NotFound(response);  // Return not found if no reviews found
            }

            return Ok(response);  // Return the reviews
        }
        //// Remove review by the user
        //[HttpDelete("user-reviews/{userId}/{reviewId}")]
        //public async Task<IActionResult> DeleteUserReviewe(string userId, Guid reviewId)
        //{
        //    var response = await _readerService.RemoveUserReview(userId, reviewId);

        //    if (!response.Success)
        //    {
        //        return NotFound(response);  
        //    }

        //    return Ok(response);  // Return the reviews
        //}

        [HttpGet("user-books/{userId}/{bookId}")]
        public async Task<IActionResult> GetUserBookStatus(string userId, Guid bookId)
        {
            var response = await _readerService.GetUserBookStatusAsync(userId, bookId);
            if (!response.Success)
            {
                return NotFound(response);
            }
            return Ok(response);
        }

        [HttpGet("profile/{userId}")]
        public async Task<IActionResult> GetReaderProfile(string userId)
        {
            var response = await _readerService.GetReaderProfileAsync(userId);
            return response.Success ? Ok(response) : NotFound(response);
        }

        [HttpPut("profile/update")]
        public async Task<IActionResult> UpdateReaderProfile([FromBody] ReaderProfileDTO profile)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var response = await _readerService.UpdateReaderProfileAsync(userId, profile);
            return response.Success ? Ok(response) : BadRequest(response);
        }


    }

}
