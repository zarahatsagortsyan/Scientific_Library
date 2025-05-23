﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ScientificLibraryBack.DTO;
using ScientificLibraryBack.Models.DB;
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
        public async Task<IActionResult> CreateBook([FromForm] BookCreateRequest bookRequest, IFormFile coverImage, IFormFile pdfFile)
        {
            var publisherId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(publisherId))
                return Unauthorized("Invalid publisher identity.");

            bookRequest.PublisherId = publisherId;

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _publisherService.CreateBookAsync(bookRequest, coverImage, pdfFile);

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
        [HttpGet("books/all")]
        public async Task<IActionResult> GetMyAllBooks(string publisherId)
        {
            var books = await _publisherService.GetNyAllBooksAsync(publisherId);

            if (books == null)
            {
                return NotFound(books);
            }

            return Ok(books);
        }
        [HttpGet("books/published")]
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

        [HttpGet("books/rejected")]
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
            var result = await _publisherService.ChangeAvailability(bookChangeAvailability);

            if (result == null)
            {
                return NotFound(result);
            }

            return Ok(result);
        }

        [HttpGet("profile/{userId}")]
        public async Task<IActionResult> GetPublisherProfile(string userId)
        {
            var response = await _publisherService.GetPublisherProfileAsync(userId);
            return response.Success ? Ok(response) : NotFound(response);
        }

        [HttpPut("profile/update")]
        public async Task<IActionResult> UpdatePublisherProfile([FromBody] PublisherProfileDTO profile)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var response = await _publisherService.UpdatePublisherProfileAsync(userId, profile);
            return response.Success ? Ok(response) : BadRequest(response);
        }



    }
}
