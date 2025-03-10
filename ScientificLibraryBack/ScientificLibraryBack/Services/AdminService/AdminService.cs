﻿using Microsoft.EntityFrameworkCore;
using ScientificLibraryBack.Models.DB;
using ScientificLibraryBack.Contextes;
using ScientificLibraryBack.Services.UserService;
using ScientificLibraryBack.DTO;
using Azure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ScientificLibraryBack.Services.AdminService
{
    public class AdminService : IAdminService
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
                var genres = await _context.Genres.Where(g => g.Name == genreRequest.Name).ToListAsync();
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

                if (genreRequest.genreDescription != genre.Description)
                    genre.Description = genreRequest.genreDescription;

                if (genreRequest.name != genre.Name)
                    genre.Name = genreRequest.name;

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

        //public async Task<ApiResponse<IEnumerable<Book>>> GetPendingBooks()
        //{
        //    var response = new ApiResponse<IEnumerable<Book>>();

        //    try
        //    {
        //        var books = await _context.Books
        //            .Where(b => b.Status == ApprovalStatus.Pending)
        //            .Include(b => b.Publisher)
        //            .ToListAsync();

        //        // Convert CoverImage to Base64 directly
        //        foreach (var book in books)
        //        {
        //            if (book.CoverImage != null && book.CoverImage.Length > 0)
        //            {
        //                var base64Image = Convert.ToBase64String(book.CoverImage);
        //                book.CoverImageUrl = $"data:image/jpeg;base64,{base64Image}";
        //            }
        //        }

        //        response.Success = true;
        //        response.Message = "Pending books retrieved successfully.";
        //        response.Data = books;
        //    }
        //    catch (Exception ex)
        //    {
        //        response.Success = false;
        //        response.Message = $"An error occurred: {ex.Message}";
        //    }

        //    return response;

        //}

        //public async Task<ApiResponse<IEnumerable<BookDTO>>> GetPendingBooks()
        //{
        //    var response = new ApiResponse<IEnumerable<BookDTO>>();

        //    try
        //    {
        //        var books = await _context.Books
        //            .Where(b => b.Status == ApprovalStatus.Pending)
        //            .Include(b => b.Publisher)
        //            .Include(b=> b.Genre)
        //            .ToListAsync();

        //        // Map Books to BookDTOs with CoverImage conversion to Base64
        //        var bookDTOs = books.Select(book => new BookDTO
        //        {
        //            Id = book.Id,
        //            Author = book.Author,
        //            ISBN = book.ISBN,
        //            Status = book.Status,
        //            Format = book.Format,
        //            Genre = book.Genre?.Name,
        //            Keywords = book.Keywords,
        //            PublisherName = book.Publisher?.UserName,
        //            Description = book.Description,
        //            Title = book.Title,
        //            PageCount = book.PageCount,
        //            IsAvailable = book.IsAvailable,
        //            PublicationDate = book.PublicationDate,
        //            State = book.State,
        //            Language = book.Language,
        //        }).ToList();

        //        response.Success = true;
        //        response.Message = "Pending books retrieved successfully.";
        //        response.Data = bookDTOs;
        //    }
        //    catch (Exception ex)
        //    {
        //        response.Success = false;
        //        response.Message = $"An error occurred: {ex.Message}";
        //    }

        //    return response;
        //}
        //public async Task<ApiResponse<IEnumerable<BookDTO>>> GetPendingBooks()
        //{
        //    var response = new ApiResponse<IEnumerable<BookDTO>>();

        //    try
        //    {
        //        var books = await _context.Books
        //            .Where(b => b.Status == ApprovalStatus.Pending)
        //            .Include(b => b.Publisher)
        //            .Include(b => b.Genre)
        //            .Include(b => b.BookKeywords) // ✅ Ensure BookKeywords are loaded
        //                .ThenInclude(bk => bk.Keyword) // ✅ Include Keywords in query
        //            .ToListAsync();

        //        // Map Books to BookDTOs with CoverImage conversion to Base64
        //        var bookDTOs = books.Select(book => new BookDTO
        //        {
        //            Id = book.Id,
        //            Author = book.Author,
        //            ISBN = book.ISBN,
        //            Status = book.Status,
        //            Format = book.Format,
        //            Genre = book.Genre?.Name, // ✅ Use Genre name

        //            Keywords = book.BookKeywords?.Select(bk => bk.Keyword.Name).ToList() ?? new List<string>(), // ✅ Extract keyword names

        //            PublisherName = book.Publisher?.UserName,
        //            Description = book.Description,
        //            Title = book.Title,
        //            PageCount = book.PageCount,
        //            IsAvailable = book.IsAvailable,
        //            PublicationDate = book.PublicationDate,
        //            State = book.State,
        //            Language = book.Language,
        //        }).ToList();

        //        response.Success = true;
        //        response.Message = "Pending books retrieved successfully.";
        //        response.Data = bookDTOs;
        //    }
        //    catch (Exception ex)
        //    {
        //        response.Success = false;
        //        response.Message = $"An error occurred: {ex.Message}";
        //    }

        //    return response;
        //}
        public async Task<ApiResponse<IEnumerable<BookDTO>>> GetPendingBooks()
        {
            var response = new ApiResponse<IEnumerable<BookDTO>>();

            try
            {
                var books = await _context.Books
                    .Where(b => b.Status == ApprovalStatus.Pending)
                    .Select(b => new
                    {
                        b.Id,
                        b.Author,
                        b.ISBN,
                        b.Status,
                        b.Format,
                        GenreName = b.Genre.Name, // ✅ Fetch Genre Name
                        PublisherName = b.Publisher.UserName, // ✅ Fetch Publisher Name
                        Keywords = b.BookKeywords.Select(bk => bk.Keyword.Name).ToList(), // ✅ Fetch Keywords as List<string>
                        b.Description,
                        b.Title,
                        b.PageCount,
                        b.IsAvailable,
                        b.PublicationDate,
                        b.State,
                        b.Language
                    })
                    .ToListAsync();

                // Convert to DTOs
                var bookDTOs = books.Select(book => new BookDTO
                {
                    Id = book.Id,
                    Author = book.Author,
                    ISBN = book.ISBN,
                    Status = book.Status,
                    Format = book.Format,
                    Genre = book.GenreName, // ✅ Use Genre Name
                    Keywords = book.Keywords, // ✅ Use List of Keywords
                    PublisherName = book.PublisherName, // ✅ Use Publisher Name
                    Description = book.Description,
                    Title = book.Title,
                    PageCount = book.PageCount,
                    IsAvailable = book.IsAvailable,
                    PublicationDate = book.PublicationDate,
                    State = book.State,
                    Language = book.Language
                }).ToList();

                response.Success = true;
                response.Message = "Pending books retrieved successfully.";
                response.Data = bookDTOs;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"An error occurred: {ex.Message}";
            }

            return response;
        }


        //public async Task<ApiResponse<IEnumerable<BookDTO>>> GetRejectedBooks()
        //{
        //    var response = new ApiResponse<IEnumerable<BookDTO>>();

        //    try
        //    {
        //        var books = await _context.Books
        //            .Where(b => b.Status == ApprovalStatus.Rejected)
        //            .Include(b => b.Publisher)
        //            .ToListAsync();

        //        // Map Books to BookDTOs with CoverImage conversion to Base64
        //        var bookDTOs = books.Select(book => new BookDTO
        //        {
        //            Id = book.Id,
        //            Author = book.Author,
        //            ISBN = book.ISBN,
        //            Status = book.Status,
        //            Format = book.Format,
        //            Genre = book.Genre,
        //            Keywords = book.Keywords,
        //            PublisherName = book.Publisher?.UserName,
        //            Description = book.Description,
        //            Title = book.Title,
        //            PageCount = book.PageCount,
        //            IsAvailable = book.IsAvailable,
        //            PublicationDate = book.PublicationDate,
        //            State = book.State,
        //            Language = book.Language,
        //        }).ToList();


        //        response.Success = true;
        //        response.Message = "Rejected books retrieved successfully.";
        //        response.Data = bookDTOs;
        //    }
        //    catch (Exception ex)
        //    {
        //        response.Success = false;
        //        response.Message = $"An error occurred: {ex.Message}";
        //    }

        //    return response;

        //}

        //public async Task<ApiResponse<IEnumerable<BookDTO>>> GetRejectedBooks()
        //{
        //    var response = new ApiResponse<IEnumerable<BookDTO>>();

        //    try
        //    {
        //        var books = await _context.Books
        //            .Where(b => b.Status == ApprovalStatus.Rejected)
        //            .Include(b => b.Publisher)
        //            .Include(b => b.Genre) // ✅ Include Genre
        //            .Include(b => b.BookKeywords) // ✅ Ensure BookKeywords are loaded
        //                .ThenInclude(bk => bk.Keyword) // ✅ Include Keywords
        //            .ToListAsync();

        //        // Map Books to BookDTOs with proper handling of Genre and Keywords
        //        var bookDTOs = books.Select(book => new BookDTO
        //        {
        //            Id = book.Id,
        //            Author = book.Author,
        //            ISBN = book.ISBN,
        //            Status = book.Status,
        //            Format = book.Format,
        //            Genre = book.Genre?.Name, // ✅ Use Genre Name
        //            Keywords = book.BookKeywords?.Select(bk => bk.Keyword.Name).ToList() ?? new List<string>(), // ✅ Extract keyword names

        //            PublisherName = book.Publisher?.UserName,
        //            Description = book.Description,
        //            Title = book.Title,
        //            PageCount = book.PageCount,
        //            IsAvailable = book.IsAvailable,
        //            PublicationDate = book.PublicationDate,
        //            State = book.State,
        //            Language = book.Language,
        //        }).ToList();

        //        response.Success = true;
        //        response.Message = "Rejected books retrieved successfully.";
        //        response.Data = bookDTOs;
        //    }
        //    catch (Exception ex)
        //    {
        //        response.Success = false;
        //        response.Message = $"An error occurred: {ex.Message}";
        //    }

        //    return response;
        //}
        public async Task<ApiResponse<IEnumerable<BookDTO>>> GetRejectedBooks()
        {
            var response = new ApiResponse<IEnumerable<BookDTO>>();

            try
            {
                var books = await _context.Books
                    .Where(b => b.Status == ApprovalStatus.Rejected)
                    .Select(b => new
                    {
                        b.Id,
                        b.Author,
                        b.ISBN,
                        b.Status,
                        b.Format,
                        GenreName = b.Genre.Name, // ✅ Fetch Genre Name
                        PublisherName = b.Publisher.UserName, // ✅ Fetch Publisher Name
                        Keywords = b.BookKeywords.Select(bk => bk.Keyword.Name).ToList(), // ✅ Fetch Keywords as List<string>
                        b.Description,
                        b.Title,
                        b.PageCount,
                        b.IsAvailable,
                        b.PublicationDate,
                        b.State,
                        b.Language
                    })
                    .ToListAsync();

                // Convert to DTOs
                var bookDTOs = books.Select(book => new BookDTO
                {
                    Id = book.Id,
                    Author = book.Author,
                    ISBN = book.ISBN,
                    Status = book.Status,
                    Format = book.Format,
                    Genre = book.GenreName, // ✅ Use Genre Name
                    Keywords = book.Keywords, // ✅ Use List of Keywords
                    PublisherName = book.PublisherName, // ✅ Use Publisher Name
                    Description = book.Description,
                    Title = book.Title,
                    PageCount = book.PageCount,
                    IsAvailable = book.IsAvailable,
                    PublicationDate = book.PublicationDate,
                    State = book.State,
                    Language = book.Language
                }).ToList();

                response.Success = true;
                response.Message = "Rejected books retrieved successfully.";
                response.Data = bookDTOs;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"An error occurred: {ex.Message}";
            }

            return response;
        }

        //public async Task<ApiResponse<IEnumerable<BookDTO>>> GetApprovedBooks()
        //{
        //    var response = new ApiResponse<IEnumerable<BookDTO>>();

        //    try
        //    {
        //        var books = await _context.Books
        //            .Where(b => b.Status == ApprovalStatus.Approved)
        //            .Include(b => b.Publisher)
        //            .ToListAsync();

        //        var bookDTOs = books.Select(book => new BookDTO
        //        {
        //            Id = book.Id,
        //            Author = book.Author,
        //            ISBN = book.ISBN,
        //            Status = book.Status,
        //            Format = book.Format,
        //            Genre = book.Genre,
        //            Keywords = book.Keywords,
        //            PublisherName = book.Publisher?.UserName,
        //            Description = book.Description,
        //            Title = book.Title,
        //            PageCount = book.PageCount,
        //            IsAvailable = book.IsAvailable,
        //            PublicationDate = book.PublicationDate,
        //            State = book.State,
        //            Language = book.Language,
        //        }).ToList();


        //        response.Success = true;
        //        response.Message = "Approved books retrieved successfully.";
        //        response.Data = bookDTOs;
        //    }
        //    catch (Exception ex)
        //    {
        //        response.Success = false;
        //        response.Message = $"An error occurred: {ex.Message}";
        //    }

        //    return response;


        //}
        //public async Task<ApiResponse<IEnumerable<BookDTO>>> GetApprovedBooks()
        //{
        //    var response = new ApiResponse<IEnumerable<BookDTO>>();

        //    try
        //    {
        //        var books = await _context.Books
        //            .Where(b => b.Status == ApprovalStatus.Approved)
        //            .Include(b => b.Publisher)
        //            .Include(b => b.Genre) // ✅ Include Genre relationship
        //            .Include(b => b.BookKeywords) // ✅ Include BookKeywords for keyword mapping
        //                .ThenInclude(bk => bk.Keyword)
        //            .ToListAsync();

        //        var bookDTOs = books.Select(book => new BookDTO
        //        {
        //            Id = book.Id,
        //            Author = book.Author,
        //            ISBN = book.ISBN,
        //            Status = book.Status,
        //            Format = book.Format,
        //            Genre = book.Genre?.Name, // ✅ Correctly fetch Genre name
        //            Keywords = book.BookKeywords?.Select(bk => bk.Keyword.Name).ToList(), // ✅ Fetch keyword names
        //            PublisherName = book.Publisher?.UserName,
        //            Description = book.Description,
        //            Title = book.Title,
        //            PageCount = book.PageCount,
        //            IsAvailable = book.IsAvailable,
        //            PublicationDate = book.PublicationDate,
        //            State = book.State,
        //            Language = book.Language,
        //        }).ToList();

        //        response.Success = true;
        //        response.Message = "Approved books retrieved successfully.";
        //        response.Data = bookDTOs;
        //    }
        //    catch (Exception ex)
        //    {
        //        response.Success = false;
        //        response.Message = $"An error occurred: {ex.Message}";
        //    }

        //    return response;
        //}

        public async Task<ApiResponse<IEnumerable<BookDTO>>> GetApprovedBooks()
        {
            var response = new ApiResponse<IEnumerable<BookDTO>>();

            try
            {
                var books = await _context.Books
                    .Where(b => b.Status == ApprovalStatus.Approved)
                    .Select(b => new
                    {
                        b.Id,
                        b.Author,
                        b.ISBN,
                        b.Status,
                        b.Format,
                        GenreName = b.Genre.Name, // ✅ Fetch Genre Name
                        PublisherName = b.Publisher.UserName, // ✅ Fetch Publisher Name
                        Keywords = b.BookKeywords.Select(bk => bk.Keyword.Name).ToList(), // ✅ Fetch Keywords as List<string>
                        b.Description,
                        b.Title,
                        b.PageCount,
                        b.IsAvailable,
                        b.PublicationDate,
                        b.State,
                        b.Language
                    })
                    .ToListAsync();

                // Convert to DTOs
                var bookDTOs = books.Select(book => new BookDTO
                {
                    Id = book.Id,
                    Author = book.Author,
                    ISBN = book.ISBN,
                    Status = book.Status,
                    Format = book.Format,
                    Genre = book.GenreName, // ✅ Use Genre Name
                    Keywords = book.Keywords, // ✅ Use List of Keywords
                    PublisherName = book.PublisherName, // ✅ Use Publisher Name
                    Description = book.Description,
                    Title = book.Title,
                    PageCount = book.PageCount,
                    IsAvailable = book.IsAvailable,
                    PublicationDate = book.PublicationDate,
                    State = book.State,
                    Language = book.Language
                }).ToList();

                response.Success = true;
                response.Message = "Approved books retrieved successfully.";
                response.Data = bookDTOs;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"An error occurred: {ex.Message}";
            }

            return response;
        }

        public async Task<ApiResponse<bool>> AddKeyword([FromBody] string keywordName)
        {

            ApiResponse<bool> apiResponse = new ApiResponse<bool>();

            try
            {
                var exists = await _context.Keywords.AnyAsync(k => k.Name == keywordName);
                if (exists)
                {
                    apiResponse.Success = false;
                    apiResponse.Data = false;
                    apiResponse.Message = "That keyword already exists";

                    return apiResponse;
                }

                Keyword newKeyword = new Keyword()
                {
                    Name = keywordName
                };

                _context.Keywords.Add(newKeyword);
                await _context.SaveChangesAsync();

                apiResponse.Success = true;
                apiResponse.Message = "Keyword created successfully.";
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
        public async Task<ApiResponse<bool>> UpdateKeyword(Guid id, string newName)
        {
            ApiResponse<bool> apiResponse = new ApiResponse<bool>();

            try
            {
                var keyword = await _context.Keywords.FindAsync(id);

                if (keyword == null)
                {
                    apiResponse.Success = false;
                    apiResponse.Data = false;
                    apiResponse.Message = "The Keyword does not exist";

                    return apiResponse;
                }


                if (newName != keyword.Name)
                    keyword.Name = newName;

                _context.Keywords.Update(keyword);
                await _context.SaveChangesAsync();

                apiResponse.Success = true;
                apiResponse.Message = "Keyword updated successfully.";
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
