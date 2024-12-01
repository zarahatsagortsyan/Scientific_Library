using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using ScientificLibraryBack.Models;
using ScientificLibraryBack.Services;

namespace ScientificLibraryBack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("GetUsers")]
        public async Task<IActionResult> GetUsers()
        {

            var users = await _userService.GetUsersAsync();
            return Ok(users);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("DeleteUser")]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            try
            {
                var result = await _userService.DeleteUserAsync(userId);

                if (result.Succeeded)
                {
                    return Ok($"User with ID '{userId}' deleted successfully.");
                }

                return BadRequest("Failed to delete the user.");
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);  // Return 404 if user is not found
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}"); // Generic error handling
            }

        }
    }
}
