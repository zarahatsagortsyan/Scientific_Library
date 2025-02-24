using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using ScientificLibraryBack.DTO;
using ScientificLibraryBack.Models;
using ScientificLibraryBack.Services.UserService;

namespace ScientificLibraryBack.Controllers
{
    [Route("api/users")]
    [Authorize(Roles = "Admin")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        // Get all users (Admin only)
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _userService.GetUsersAsync();
            return Ok(users);
        }

        // Delete a specific user by ID (Admin only)
        [Authorize(Roles = "Admin")]
        [HttpDelete("{userId}")]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            try
            {
                var result = await _userService.DeleteUserAsync(userId);

                if (result.Succeeded)
                {
                    return Ok(new { message = $"User with ID '{userId}' deleted successfully." });
                }

                return BadRequest(new { error = "Failed to delete the user." });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { error = ex.Message }); // Return 404 if user is not found
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = $"Internal server error: {ex.Message}" }); // Generic error handling
            }
        }

        // Get active readers
        [HttpGet("readers/active")]
        public async Task<IActionResult> GetActiveReaders()
        {
            try
            {
                var activeReaders = await _userService.GetActiveReadersAsync();
                return Ok(activeReaders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // Get active publishers
        [HttpGet("publishers/active")]
        public async Task<IActionResult> GetActivePublishers()
        {
            try
            {
                var activePublishers = await _userService.GetActivePublishersAsync();
                return Ok(activePublishers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPut("ban")]
        public async Task<IActionResult> BanUser(string userId)
        {
            var result = await _userService.BanUser(userId);

            if (result.Success == false)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPut("unban")]
        public async Task<IActionResult> UnBanUser(string userId)
        {
            var result = await _userService.UnBanUser(userId);

            if (result.Success == false)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
    }
}
