using Microsoft.EntityFrameworkCore;
using ScientificLibraryBack.Models.DB;
using ScientificLibraryBack.Contextes;
using ScientificLibraryBack.Services.UserService;
using ScientificLibraryBack.DTO;
using Azure;

namespace ScientificLibraryBack.Services.AdminService
{
    public class AdminService:IAdminService
    {
        private readonly ApplicationDbContext _context;
        public AdminService(IUserService userService, ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<ApiResponse<bool>> ApproveBook(Guid bookId)
        {
            var response = new ApiResponse<bool>();

            try
            {
                // Retrieve the existing book from the database
                var existingBook = await _context.Books.FindAsync(bookId);
                if (existingBook == null)
                {
                    response.Success = false;
                    response.Message = "Book not found.";
                    response.Data = false;
                    return response;
                }

                existingBook.Status = ApprovalStatus.Approved;
                // Save changes to the database
                _context.Books.Update(existingBook); // This ensures only modified fields are persisted
                await _context.SaveChangesAsync();

                response.Success = true;
                response.Message = "Book approved successfully.";
                response.Data = true;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"An error occurred: {ex.Message}";
            }

            return response;
        }

        public async Task<ApiResponse<bool>> RejectBook(Guid bookId)
        {
            var response = new ApiResponse<bool>();

            try
            {
                // Retrieve the existing book from the database
                var existingBook = await _context.Books.FindAsync(bookId);
                if (existingBook == null)
                {
                    response.Success = false;
                    response.Message = "Book not found.";
                    response.Data = false;
                    return response;
                }

                existingBook.Status = ApprovalStatus.Rejected;
                // Save changes to the database
                _context.Books.Update(existingBook); // This ensures only modified fields are persisted
                await _context.SaveChangesAsync();

                response.Success = true;
                response.Message = "Book rejected successfully.";
                response.Data = true;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"An error occurred: {ex.Message}";
            }

            return response;
        }

        public async Task<ApiResponse<bool>> CreateGenre(CreateGenreRequest genreRequest)
        { 
        
            ApiResponse<bool> apiResponse = new ApiResponse<bool>();

            try
            {
                var genres = await _context.Genres.Where(g=>g.Name == genreRequest.Name).ToListAsync();
                if (genres.Count > 0)
                {
                    apiResponse.Success = false;
                    apiResponse.Data = false;
                    apiResponse.Message = "That genre already exists";

                    return apiResponse;
                }

                Genre newGenre = new Genre()
                {
                    Name = genreRequest.Name,
                    Description = genreRequest.Description,
                };

                _context.Genres.Add(newGenre);
                await _context.SaveChangesAsync();

                apiResponse.Success = true;
                apiResponse.Message = "Genre created successfully.";
                apiResponse.Data = true;

            }
            catch (Exception ex)
            {
                apiResponse.Success = false;
                apiResponse.Message = $"An error occurred: {ex.Message}";

                return apiResponse;
            }
            return apiResponse;
        }

        public async Task<ApiResponse<bool>> DeleteGenre(int genreId)
        {
            ApiResponse<bool> apiResponse = new ApiResponse<bool>();

            try
            {
                var genre = await _context.Genres.FindAsync(genreId);

                if (genre == null)
                {
                    apiResponse.Success = false;
                    apiResponse.Data = false;
                    apiResponse.Message = "The genre does not exist";

                    return apiResponse;
                }

                _context.Genres.Remove(genre);
                await _context.SaveChangesAsync();

                apiResponse.Success = true;
                apiResponse.Message = "Genre deleted successfully.";
                apiResponse.Data = true;
            }
            catch (Exception ex)
            {
                apiResponse.Success = false;
                apiResponse.Message = $"An error occurred: {ex.Message}";

                return apiResponse;
            }
            return apiResponse;
        }

        public async Task<ApiResponse<bool>> UpdateGenre(UpdateGenreRequest genreRequest)
        {
            ApiResponse<bool> apiResponse = new ApiResponse<bool>();

            try
            {
                var genre = await _context.Genres.FindAsync(genreRequest.genreId);

                if (genre == null)
                {
                    apiResponse.Success = false;
                    apiResponse.Data = false;
                    apiResponse.Message = "The genre does not exist";

                    return apiResponse;
                }

                genre.Description = genreRequest.genreDescription;

                _context.Genres.Update(genre);
                await _context.SaveChangesAsync();

                apiResponse.Success = true;
                apiResponse.Message = "Genre updated successfully.";
                apiResponse.Data = true;
            }
            catch (Exception ex)
            {
                apiResponse.Success = false;
                apiResponse.Message = $"An error occurred: {ex.Message}";

                return apiResponse;
            }
            return apiResponse;
        }
    }
}
