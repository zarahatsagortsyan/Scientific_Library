﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ScientificLibraryBack.DTO;
using ScientificLibraryBack.Services.AdminService;

namespace ScientificLibraryBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : Controller
    {
        private readonly IAdminService _adminService;
        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpPut("books/approve")]
        public async Task<IActionResult> ApproveBook(Guid bookId)
        {
            if (!User.Identity.IsAuthenticated)
                return Unauthorized(new ApiResponse<string> {
                    Success = false, Message = "User not authenticated" });
            var response = await _adminService.ApproveBook(bookId);

            if (response.Success)
                return Ok(response);
            return BadRequest(response);
        }


        [HttpPatch("books/reject")]
        public async Task<IActionResult> RejectBook(Guid bookId)
        {
            if (!User.Identity.IsAuthenticated)
            {
                Console.WriteLine("User not authenticated");
                return Unauthorized(new ApiResponse<string> { Success = false, Message = "User not authenticated" });
            }
            var response = await _adminService.RejectBook(bookId);

            if (response.Success)
            {
                return Ok(response);
            }

            return BadRequest(response);
        }

        [HttpPost("genres")]
        public async Task<IActionResult> CreateGenre(CreateGenreRequest genreRequest)
        {
            var response = await _adminService.CreateGenre(genreRequest);

            if (response.Success)
            {
                return Ok(response);
            }

            return BadRequest(response);
        }

        [HttpDelete("genres/{id}")]
        public async Task<IActionResult> DeleteGenre(int id)
        {
            var response = await _adminService.DeleteGenre(id);

            if (response.Success)
            {
                return Ok(response);
            }

            return BadRequest(response);
        }

        [HttpPatch("genres/{id}")]
        public async Task<IActionResult> UpdateGenre(int id, UpdateGenreRequest updateGenre)
        {
            updateGenre.genreId = id;

            var response = await _adminService.UpdateGenre(updateGenre);

            if (response.Success)
            {
                return Ok(response);
            }

            return BadRequest(response);
        }

        [HttpGet("books/pending")]
        public async Task<IActionResult> GetPendingBooks()
        {
            var books = await _adminService.GetPendingBooks();

            if (books == null)
            {
                return NotFound(books);
            }

            return Ok(books);
        }

        [HttpGet("books/rejected")]
        public async Task<IActionResult> GetRejectedBooks()
        {
            var books = await _adminService.GetRejectedBooks();

            if (books == null)
            {
                return NotFound(books);
            }

            return Ok(books);
        }

        [HttpGet("books/all")]
        public async Task<IActionResult> GetAllBooks()
        {
            var books = await _adminService.GetAllBooks();

            if (books == null)
            {
                return NotFound(books);
            }

            return Ok(books);
        }
        [HttpGet("books/approved")]
        public async Task<IActionResult> GetApprovedBooks()
        {
            var books = await _adminService.GetApprovedBooks();

            if (books == null)
            {
                return NotFound(books);
            }

            return Ok(books);
        }
        [HttpPost("keywords")]
        public async Task<IActionResult> CreateKeyword([FromBody] KeywordCreateRequest request)
        {
            var response = await _adminService.AddKeyword(request.Name);

            if (response.Success)
            {
                return Ok(response);
            }

            return BadRequest(response);
        }

        [HttpPatch("keywords/{id}")]
        public async Task<IActionResult> UpdateKeyword(Guid id, [FromBody] KeywordCreateRequest request)
        {
            var response = await _adminService.UpdateKeyword(id, request.Name);

            if (response.Success)
            {
                return Ok(response);
            }

            return BadRequest(response);
        }

        // Get all messages
        [HttpGet("messages")]
        public async Task<IActionResult> GetMessages()
        {
            var response = await _adminService.GetAllMessagesAsync();
            return Ok(response);
        }

        // Mark a message as replied
        [HttpPut("messages/{id}/reply")]
        public async Task<IActionResult> MarkMessageAsReplied(int id)
        {
            var response = await _adminService.MarkAsRepliedAsync(id);
            return Ok(response);
        }
    }
}
