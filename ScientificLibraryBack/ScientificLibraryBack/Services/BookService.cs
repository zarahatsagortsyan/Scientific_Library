using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ScientificLibraryBack.Contextes;
using ScientificLibraryBack.Models;
using ScientificLibraryBack.Models.DB;

namespace ScientificLibraryBack.Services
{
    public class BookService : IBookService
    {
        private readonly IUserService _userService;
        private readonly ApplicationDbContext _context;
        public BookService(IUserService userService, ApplicationDbContext context)
        {
            _userService = userService;
            _context = context;
        }
        public async Task<ApiResponse<Guid>> CreateBookAsync(Book book)
        {
            var response = new ApiResponse<Guid>(); // Change the type to Guid

            try
            {
                if (string.IsNullOrWhiteSpace(book.Title) || string.IsNullOrWhiteSpace(book.Author))
                {
                    response.Success = false;
                    response.Message = "Required fields are missing.";
                    return response;
                }

                _context.Books.Add(book);
                await _context.SaveChangesAsync();

                response.Success = true;
                response.Message = "Book created successfully.";
                response.Data = book.Id; // Set the Id of the newly created book as the response data

                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"An error occurred: {ex.Message}";
                return response;
            }
        }

        public Task<ApiResponse<bool>> DeleteBookAsync(Guid bookId)
        {
            throw new NotImplementedException();
        }

        public Task<ApiResponse<IEnumerable<Book>>> GetAllBooksAsync()
        {
            throw new NotImplementedException();
        }

        public async Task<Book> GetBookByIdAsync(Guid bookId)
        {
            return await _context.Books
                .Include(b => b.Reviews)  // Optionally include related entities like Reviews
                .FirstOrDefaultAsync(b => b.Id == bookId);
        }

        public Task<ApiResponse<IEnumerable<Book>>> GetBooksByGenreAsync(string genre)
        {
            throw new NotImplementedException();
        }

        public Task<ApiResponse<IEnumerable<Book>>> SearchBooksAsync(string keyword)
        {
            throw new NotImplementedException();
        }

        public Task<ApiResponse<bool>> UpdateBookAsync(Book book)
        {
            throw new NotImplementedException();
        }
    }
}
