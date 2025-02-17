﻿using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ScientificLibraryBack.Contextes;
using ScientificLibraryBack.DTO;
using ScientificLibraryBack.Models.DB;
using ScientificLibraryBack.Services.BookService;
using ScientificLibraryBack.Services.UserService;


using System.Net;

namespace ScientificLibraryBack.Services.BookService
{
    public class ReaderService : IReaderService
    {
        private readonly IUserService _userService;
        private readonly ApplicationDbContext _context;
        public ReaderService(IUserService userService, ApplicationDbContext context)
        {
            _userService = userService;
            _context = context;
        }

        public async Task<ApiResponse<Guid>> AddBookToUserListAsync(Guid bookId, string userId, ReadingStatus status)
        {
            var response = new ApiResponse<Guid>();

            try
            {
                var exists = await _context.UserBooks.AnyAsync(ub => ub.BookId == bookId && ub.UserId == userId);
                if (exists)
                {
                    response.Success = false;
                    response.Message = "This book is already in the user's list.";
                    return response;
                }

                var userBook = new UserBook
                {
                    Id = Guid.NewGuid(),
                    BookId = bookId,
                    UserId = userId,
                    ReadingStatus = status,
                    FinishedDate = status == ReadingStatus.Read ? DateTime.UtcNow : (DateTime?)null
                };

                _context.UserBooks.Add(userBook);
                await _context.SaveChangesAsync();

                response.Success = true;
                response.Message = "Book added to user list successfully.";
                response.Data = userBook.Id;

                return response;
            }
            catch (DbUpdateException ex)
            {
                response.Success = false;
                response.Message = "An error occurred while saving to the database.";
                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"An error occurred: {ex.Message}";
                return response;
            }
        }


        public async Task<ApiResponse<bool>> RemoveBookFromUserList(string userId, Guid bookId)
        {
            var response = new ApiResponse<bool>();

            var toReadBook = await _context.UserBooks
                .FirstOrDefaultAsync(trb => trb.UserId == userId.ToString() && trb.BookId == bookId);

            if (toReadBook == null)
            {
                response.Success = false;
                response.Message = "Book not found in your To-Read list.";
                response.Data = false;
                return response;
            }

            _context.UserBooks.Remove(toReadBook);
            await _context.SaveChangesAsync();

            response.Success = true;
            response.Message = "Book removed from your To-Read list.";
            response.Data = true;

            return response;
        }

        public async Task<ApiResponse<bool>> UpdateReadingStatusAsync(Guid bookId, string userId, ReadingStatus newStatus)
        {
            var response = new ApiResponse<bool>();

            try
            {
                // Find the UserBook
                var userBook = await _context.UserBooks
                    .FirstOrDefaultAsync(ub => ub.BookId == bookId && ub.UserId == userId);

                if (userBook == null)
                {
                    response.Success = false;
                    response.Message = "UserBook not found.";
                    return response;
                }

                // Update status and FinishedDate
                userBook.ReadingStatus = newStatus;
                userBook.FinishedDate = newStatus == ReadingStatus.Read ? DateTime.UtcNow : (DateTime?)null;

                _context.UserBooks.Update(userBook);
                await _context.SaveChangesAsync();

                response.Success = true;
                response.Message = "Reading status updated successfully.";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"An error occurred: {ex.Message}";
            }

            return response;
        }
       

        public async Task<ApiResponse<IEnumerable<UserBook>>> GetUserBooksAsync(string userId, ReadingStatus? status = null)
        {
            var response = new ApiResponse<IEnumerable<UserBook>>();

            try
            {
                var query = _context.UserBooks.AsQueryable();

                // Filter by user and optional status
                query = query.Where(ub => ub.UserId == userId);

                if (status.HasValue)
                {
                    query = query.Where(ub => ub.ReadingStatus == status.Value);
                }

                var userBooks = await query.ToListAsync();

                response.Success = true;
                response.Data = userBooks;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"An error occurred: {ex.Message}";
            }

            return response;
        }

        public async Task<ApiResponse<Review>> AddReviewAsync(string userId, Guid bookId, string reviewText, int rating)
        {
            var response = new ApiResponse<Review>();

            // Validation for review text and rating
            if (string.IsNullOrWhiteSpace(reviewText) || rating < 1 || rating > 5)
            {
                response.Success = false;
                response.Message = "Invalid review input.";
                return response;
            }

            // Check if the book exists
            var book = await _context.Books.FindAsync(bookId);
            if (book == null)
            {
                response.Success = false;
                response.Message = "Book not found.";
                return response;
            }

            // Create new review
            var review = new Review
            {
                ReviewText = reviewText,
                Rating = rating,
                CreatedAt = DateTime.UtcNow,
                UserId = userId.ToString(),
                BookId = bookId
            };

            // Save review to the database
            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            response.Success = true;
            response.Message = "Review added successfully.";
            response.Data = review;

            return response;
        }
        public async Task<ApiResponse<bool>> DeleteReviewAsync(string userId, Guid bookId)
        {
            var response = new ApiResponse<bool>();

            // Find the review to delete
            var review = await _context.Reviews
                .FirstOrDefaultAsync(r => r.UserId == userId.ToString() && r.BookId == bookId);

            if (review == null)
            {
                response.Success = false;
                response.Message = "Review not found.";
                response.Data = false;
                return response;
            }

            // Remove review from the database
            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();

            response.Success = true;
            response.Message = "Review deleted successfully.";
            response.Data = true;

            return response;
        }

        public async Task<ApiResponse<IEnumerable<Review>>> GetUserReviewedBooksAsync(string userId)
        {
            var response = new ApiResponse<IEnumerable<Review>>();

            try
            {
                var query = _context.Reviews.AsQueryable();

                // Filter by user and optional status
                query = query.Where(ub => ub.UserId == userId);

                var userReviews = await query.ToListAsync();

                response.Success = true;
                response.Data = userReviews;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"An error occurred: {ex.Message}";
            }
            return response;
        }
    }
}
