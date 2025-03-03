using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScientificLibraryBack.Models.DB;
using System.Collections;
using ScientificLibraryBack.Services.AuthService;
using ScientificLibraryBack.DTO;

namespace ScientificLibraryBack.Services.UserService
{
    public class UserService : IUserService
    {

        private readonly UserManager<ExtendedIdentityUser> _userManager;
        public UserService(UserManager<ExtendedIdentityUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task<IEnumerable<ExtendedIdentityUser>> GetUsersAsync()
        {
            var users = await _userManager.Users.ToListAsync(); // Ensure this line is async
            return users;
        }

        public async Task<IdentityResult> DeleteUserAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                // Return failure if the user doesn't exist
                throw new KeyNotFoundException($"User with ID '{userId}' not found.");
            }

            // Attempt to delete the user
            var result = await _userManager.DeleteAsync(user);
            return result;

        }

        //public async Task<IEnumerable<ExtendedIdentityUser>> GetActiveReadersAsync()
        //{

        //    return await _userManager.Users.Where(u => u.Type == UserType.Reader && u.IsActive == true).ToListAsync();
        //}
        //public async Task<ApiResponse<IEnumerable<ExtendedIdentityUser>>> GetActiveReadersAsync()
        //{


        //    var activeReaders = await _userManager.Users
        //        .Where(u => u.Type == UserType.Reader && u.IsActive == true)
        //        .ToListAsync();

        //    return new ApiResponse<IEnumerable<ExtendedIdentityUser>>
        //    {
        //        Success = true,
        //        Message = "Active readers retrieved successfully.",
        //        Data = activeReaders
        //    };
        //}

        public async Task<ApiResponse<IEnumerable<UserDTO>>> GetActiveReadersAsync()
        {
            var activeReaders = await _userManager.Users
                .Where(u => u.Type == UserType.Reader && u.IsActive == true)
                .Select(u => new UserDTO
                {
                    Id = u.Id,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    CompanyName = "",
                    //UserName = u.UserName,
                    Email = u.Email,
                    Type = u.Type,
                    Banned = u.Banned,
                    CreatedDate = u.CreatedAt,
                    BirthDate = u.DateOfBirth
                })
                .ToListAsync();

            return new ApiResponse<IEnumerable<UserDTO>>
            {
                Success = true,
                Message = "Active readers retrieved successfully.",
                Data = activeReaders
            };
        }

        public async Task<ApiResponse<IEnumerable<UserDTO>>> GetActivePublishersAsync()
        {
            var activeReaders = await _userManager.Users
                .Where(u => u.Type == UserType.Publisher && u.IsActive == true)
                .Select(u => new UserDTO
                {
                    Id = u.Id,
                    //UserName = u.UserName,
                    CompanyName= u.CompanyName,
                    Email = u.Email,
                    Type = u.Type,
                    Banned = u.Banned,
                    CreatedDate = u.CreatedAt,
                    BirthDate = u.DateOfBirth
                })
                .ToListAsync();

            return new ApiResponse<IEnumerable<UserDTO>>
            {
                Success = true,
                Message = "Active publishers retrieved successfully.",
                Data = activeReaders
            };
        }
        //public async Task<IEnumerable<ExtendedIdentityUser>> GetActivePublishersAsync()
        //{
        //    return await _userManager.Users.Where(u => u.Type == UserType.Publisher && u.IsActive == true).ToListAsync();
        //}


        public async Task<ApiResponse<bool>> BanUser(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null)
                return new ApiResponse<bool> { Success = false, Message = "User not found", Data = false };

            user.Banned = true;
            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded)
                return new ApiResponse<bool> { Success = true, Message = "User banned successfully", Data = true };

            return new ApiResponse<bool> { Success = false, Message = "Failed to ban user", Data = false };
        }

        public async Task<ApiResponse<bool>> UnBanUser(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null)
                return new ApiResponse<bool> { Success = false, Message = "User not found", Data = false };

            user.Banned = false;
            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded)
                return new ApiResponse<bool> { Success = true, Message = "User unbanned successfully", Data = true };

            return new ApiResponse<bool> { Success = false, Message = "Failed to ban user", Data = false };
        }
    }
}
