using Microsoft.AspNetCore.Identity;
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
        private readonly IBookService _bookService;
        private readonly IUserService _userService;
        private readonly ApplicationDbContext _context;
        public ReaderService(IUserService userService, IBookService bookService, ApplicationDbContext context)
        {
            _userService = userService;
            _context = context;
            _bookService = bookService;
        }

        public async Task<ApiResponse<Guid>> AddBookToUserListAsync(Guid bookId, string userId, ReadingStatus status)
        {
            var response = new ApiResponse<Guid>();

            try
            {
                var exists = _context.UserBooks.Where(ub => ub.BookId == bookId && ub.UserId == userId).FirstOrDefault();

                if (exists != null && exists.ReadingStatus == status)
                {
                    response.Success = false;
                    response.Message = "This book is already in the user's list.";
                    return response;
                }

                if (exists == null)
                {
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
                }

                if (exists != null && exists.ReadingStatus != status)
                {
                    exists.ReadingStatus = status;
                    _context.UserBooks.Update(exists);
                    await _context.SaveChangesAsync();

                    response.Success = true;
                    response.Message = "Changed book list successfully.";
                    response.Data = exists.Id;
                }

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


        //public async Task<ApiResponse<IEnumerable<UserBook>>> GetUserBooksAsync(string userId, ReadingStatus? status = null)
        //{
        //    var response = new ApiResponse<IEnumerable<UserBook>>();

        //    try
        //    {
        //        var query = _context.UserBooks.AsQueryable();

        //        // Filter by user and optional status
        //        query = query.Where(ub => ub.UserId == userId);

        //        if (status.HasValue)
        //        {
        //            query = query.Where(ub => ub.ReadingStatus == status.Value);
        //        }

        //        var userBooks = await query.ToListAsync();

        //        response.Success = true;
        //        response.Data = userBooks;
        //    }
        //    catch (Exception ex)
        //    {
        //        response.Success = false;
        //        response.Message = $"An error occurred: {ex.Message}";
        //    }

        //    return response;
        //}
        public async Task<ApiResponse<IEnumerable<UserBookDTO>>> GetUserBooksAsync(string userId, ReadingStatus? status = null)
        {
            var response = new ApiResponse<IEnumerable<UserBookDTO>>();

            try
            {
                // Filter by user and optional status
                var query = _context.UserBooks.Where(b => b.UserId == userId);

                if (status.HasValue)
                {
                    query = query.Where(ub => ub.ReadingStatus == status.Value);
                }

                // Execute the query with the filter applied
                var userBooks = await query.ToListAsync();

                // Map UserBooks to UserBookDTOs including BookInfo
                var bookDTOs = new List<UserBookDTO>();

                foreach (var userBook in userBooks)
                {
                    var bookInfo = await _bookService.GetBookByIdAsync(userBook.BookId);

                    bookDTOs.Add(new UserBookDTO
                    {
                        Id = userBook.Id,
                        BookId = userBook.BookId,
                        UserId = userBook.UserId,
                        FinishedDate = userBook.FinishedDate,
                        ReadingStatus = userBook.ReadingStatus,
                        BookInfo = bookInfo.Data // Assuming GetBookByIdAsync returns ApiResponse<BookDTO>
                    });
                }

                response.Success = true;
                response.Data = bookDTOs;
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
        public async Task<ApiResponse<bool>> DeleteReviewAsync(string userId, Guid reviewId)
        {
            var response = new ApiResponse<bool>();

            // Find the review to delete
            var review = await _context.Reviews
                .FirstOrDefaultAsync(r => r.UserId == userId.ToString() && r.Id == reviewId);

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

        //public async Task<ApiResponse<IEnumerable<Review>>> GetUserReviewedBooksAsync(string userId)
        //{
        //    var response = new ApiResponse<IEnumerable<Review>>();

        //    try
        //    {
        //        var query = _context.Reviews.AsQueryable();

        //        // Filter by user and optional status
        //        query = query.Where(ub => ub.UserId == userId);

        //        var userReviews = await query.ToListAsync();

        //        response.Success = true;
        //        response.Data = userReviews;
        //    }
        //    catch (Exception ex)
        //    {
        //        response.Success = false;
        //        response.Message = $"An error occurred: {ex.Message}";
        //    }
        //    return response;
        //}
        //public async Task<ApiResponse<IEnumerable<ReviewDTO>>> GetUserReviewedBooksAsync(string userId)
        //{
        //    var response = new ApiResponse<IEnumerable<ReviewDTO>>();

        //    // Retrieve reviews for the given book
        //    var reviews = await _context.Reviews
        //        .Where(r => r.UserId == userId)
        //        .Include(b=> b.Book)
        //        .Include(r => r.User)  // You can include user info if needed
        //    .ToListAsync();

        //    var reviewsDTOs = reviews.Select(review => new ReviewDTO
        //    {
        //        Id = review.Id,
        //        BookId = review.BookId,
        //        CreatedAt = review.CreatedAt,
        //        Rating = review.Rating,
        //        ReviewText = review.ReviewText,
        //        UserId = review.UserId,
        //        UserName = review.User.UserName!,
        //        BookTitle = review.Book.Title,
        //    }).ToList();


        //    response.Success = true;
        //    response.Message = "Reviews fetched successfully.";
        //    response.Data = reviewsDTOs;

        //    return response;
        //}

        public async Task<ApiResponse<IEnumerable<ReviewDTO>>> GetUserReviewedBooksAsync(string userId)
        {
            var response = new ApiResponse<IEnumerable<ReviewDTO>>();

            try
            {
                // Directly project to ReviewDTO to avoid unnecessary memory usage
                var reviewsDTOs = await _context.Reviews
                    .Where(r => r.UserId == userId)
                    .Select(review => new ReviewDTO
                    {
                        Id = review.Id,
                        BookId = review.BookId,
                        CreatedAt = review.CreatedAt,
                        Rating = review.Rating,
                        ReviewText = review.ReviewText,
                        UserId = review.UserId,
                        UserName = review.User.UserName!,
                        BookTitle = review.Book.Title,
                    })
                    .ToListAsync();

                response.Success = true;
                response.Message = "Reviews fetched successfully.";
                response.Data = reviewsDTOs;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"An error occurred: {ex.Message}";
                response.Data = Enumerable.Empty<ReviewDTO>();
            }

            return response;
        }


        //public async Task<ApiResponse<bool>> RemoveUserReview(string userId, Guid reviewId)
        //{
        //    var response = new ApiResponse<bool>();

        //    var userReview = await _context.Reviews
        //        .FirstOrDefaultAsync(trb => trb.UserId == userId.ToString() && trb.Id == reviewId);

        //    if (userReview == null)
        //    {
        //        response.Success = false;
        //        response.Message = "Review not found in your Review list.";
        //        response.Data = false;
        //        return response;
        //    }

        //    _context.Reviews.Remove(userReview);
        //    await _context.SaveChangesAsync();

        //    response.Success = true;
        //    response.Message = "Review removed from your Reviews list.";
        //    response.Data = true;

        //    return response;
        //}


        public async Task<ApiResponse<ReadingStatus?>> GetUserBookStatusAsync(string userId, Guid bookId)
        {
            var userBook = await _context.UserBooks
                .FirstOrDefaultAsync(ub => ub.UserId == userId && ub.BookId == bookId);

            if (userBook == null)
            {
                return new ApiResponse<ReadingStatus?>
                {
                    Success = true,
                    Message = "No reading status found for this book and user."
                };
            }

            return new ApiResponse<ReadingStatus?>
            {
                Success = true,
                Data = userBook.ReadingStatus
            };
        }
    }
}
