﻿using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScientificLibraryBack.Models.DB;
using System.Collections;

namespace ScientificLibraryBack.Services
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


    }
}
