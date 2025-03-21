﻿using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ScientificLibraryBack.Contextes;
using ScientificLibraryBack.DTO;
using ScientificLibraryBack.Models.DB;
using ScientificLibraryBack.Services.BookService;
using ScientificLibraryBack.Services.UserService;


using System.Net;
using static System.Reflection.Metadata.BlobBuilder;

namespace ScientificLibraryBack.Services.BookService
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

        public Task<ApiResponse<bool>> ChangeAvailibility(bool available)
        {
            throw new NotImplementedException();
        }

        //public async Task<ApiResponse<Guid>> CreateBookAsync(BookCreateRequest bookRequest)
        //{
        //    var response = new ApiResponse<Guid>(); // Change the type to Guid

        //    try
        //    {
        //        if (string.IsNullOrWhiteSpace(bookRequest.Title) || string.IsNullOrWhiteSpace(bookRequest.Author))
        //        {
        //            response.Success = false;
        //            response.Message = "Required fields are missing.";
        //            return response;
        //        }

        //        // Map BookCreateRequest to Book
        //        var book = new Book
        //        {
        //            Id = Guid.NewGuid(), // Generate a new GUID
        //            Title = bookRequest.Title,
        //            Author = bookRequest.Author,
        //            Genre = bookRequest.Genre,
        //            Description = bookRequest.Description,
        //            ISBN = bookRequest.ISBN,
        //            CoverImage = bookRequest.CoverImage,
        //            //CoverImageUrl = bookRequest.CoverImageUrl,
        //            PublicationDate = bookRequest.PublicationDate,
        //            PageCount = bookRequest.PageCount,
        //            Language = bookRequest.Language,
        //            Format = bookRequest.Format,
        //            Keywords = bookRequest.Keywords,
        //            IsAvailable = bookRequest.IsAvailable,
        //            Status = ApprovalStatus.Pending,
        //            State = State.New,
        //            PublisherId = bookRequest.PublisherId,


        //        };

        //        _context.Books.Add(book);
        //        await _context.SaveChangesAsync();

        //        response.Success = true;
        //        response.Message = "Book created successfully.";
        //        response.Data = book.Id; // Set the Id of the newly created book as the response data

        //        return response;
        //    }
        //    catch (Exception ex)
        //    {
        //        response.Success = false;
        //        response.Message = $"An error occurred: {ex.Message}";
        //        return response;
        //    }
        //}

        public Task<ApiResponse<bool>> DeleteBookAsync(Guid bookId)
        {
            throw new NotImplementedException();
        }

        //public async Task<ApiResponse<IEnumerable<Book>>> GetAllBooksAsync()
        //{
        //    var response = new ApiResponse<IEnumerable<Book>>();

        //    try
        //    {
        //        // Fetch books with related entities
        //        var books = await _context.Books
        //            //.Include(b => b.Publisher)
        //            //.Include(b => b.Reviews)
        //            .Where(b => b.Status == ApprovalStatus.Approved).ToListAsync();

        //        // Convert CoverImage to Base64 directly

        //        foreach (var book in books)
        //        {
        //            //if (book.CoverImage != null && book.CoverImage.Length > 0)
        //            //{
        //            //    //var base64Image = Convert.ToBase64String(book.CoverImage);
        //            //    //book.CoverImageUrl = "";//$"data:image/jpeg;base64,{base64Image}";
        //            //    //book.CoverImage = null;
        //            book.CoverImage = null;
        //            book.PdfFile = null;
        //            book.Publisher = null;
        //            //}
        //        }
        //        // Wrap the result in ApiResponse
        //        response.Success = true;
        //        response.Message = "Books retrieved successfully.";
        //        response.Data = books; // Assign the books to the Data property
        //    }
        //    catch (Exception ex)
        //    {
        //        response.Success = false;
        //        response.Message = $"An error occurred: {ex.Message}";
        //    }

        //    return response;
        //}
        public async Task<ApiResponse<IEnumerable<BookDTO>>> GetAllBooksAsync()
        {
            var response = new ApiResponse<IEnumerable<BookDTO>>();

            try
            {
                // Fetch books with only necessary fields using projection
                var books = await _context.Books
                    .Where(b => b.Status == ApprovalStatus.Approved && b.IsAvailable == true)
                    .Select(b => new BookDTO
                    {
                        Id = b.Id,
                        Author = b.Author,
                        ISBN = b.ISBN,
                        Status = b.Status,
                        //Format = b.Format,
                        Genre = b.Genre.Name, //  Get Genre Name
                        Keywords = b.BookKeywords.Select(bk => bk.Keyword.Name).ToList(), //  Fetch Keywords
                        PublisherName = b.Publisher.UserName, //  Fetch Publisher Name
                        Description = b.Description,
                        Title = b.Title,
                        PageCount = b.PageCount,
                        IsAvailable = b.IsAvailable,
                        PublicationDate = b.PublicationDate,
                        State = b.State,
                        Language = b.Language,
                    })
                    .ToListAsync();

                response.Success = true;
                response.Message = "Books retrieved successfully.";
                response.Data = books;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"An error occurred: {ex.Message}";
            }

            return response;
        }

        //public async Task<IEnumerable<Book>> GetApprovedBooksAsync(Guid publisherId)
        //{
        //    return await _context.Books
        //            .Where(b => b.PublisherId == publisherId && b.Status == ApprovalStatus.Approved).ToListAsync();
        //}

        //public async Task<ApiResponse<BookDTO>> GetBookByIdAsync(Guid bookId)
        //{
        //    var response = new ApiResponse<BookDTO>();
        //    BookDTO bookResponse = new BookDTO();
        //    try
        //    {
        //        // Fetch books with related entities
        //        var book = await _context.Books
        //                    .Include(b => b.Publisher)
        //                    //.Include(b => b.Reviews)  // Optionally include related entities like Reviews
        //                    .FirstOrDefaultAsync(b => b.Id == bookId);

        //        // Convert CoverImage to Base64 directly

        //        //if (book.CoverImage != null && book.CoverImage.Length > 0)
        //        //{
        //        //    var base64Image = Convert.ToBase64String(book.CoverImage);
        //        //    book.CoverImageUrl = $"data:image/jpeg;base64,{base64Image}";
        //        //}
        //        if (book != null)
        //        {
        //            bookResponse.Id = book.Id;
        //            bookResponse.Author = book.Author;
        //            bookResponse.ISBN = book.ISBN;
        //            bookResponse.Status = book.Status;
        //            bookResponse.Format = book.Format;
        //            bookResponse.Genre = book.Genre;
        //            bookResponse.Keywords = book.Keywords;
        //            bookResponse.PublisherName = book.Publisher.UserName;
        //            bookResponse.Description = book.Description;
        //            bookResponse.Title = book.Title;
        //            bookResponse.PageCount = book.PageCount;
        //            bookResponse.IsAvailable = book.IsAvailable;
        //            bookResponse.PublicationDate = book.PublicationDate;
        //            bookResponse.State = book.State;
        //            bookResponse.Language = book.Language;

        //            // Wrap the result in ApiResponse
        //            response.Success = true;
        //            response.Message = "Books retrieved successfully.";
        //            response.Data = bookResponse; // Assign the books to the Data property
        //        }
        //        else
        //        {
        //            response.Success = false;
        //            response.Message = "Book not found.";
        //            response.Data = bookResponse; // Assign the books to the Data property

        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        response.Success = false;
        //        response.Message = $"An error occurred: {ex.Message}";
        //    }

        //    return response;
        //}

        //public async Task<ApiResponse<BookDTO>> GetBookByIdAsync(Guid bookId)
        //{
        //    var response = new ApiResponse<BookDTO>();

        //    try
        //    {
        //        // Fetch book with related entities
        //        var book = await _context.Books
        //            .Include(b => b.Publisher) //  Ensure Publisher is loaded
        //            .Include(b => b.Genre) //  Ensure Genre is loaded
        //            .Include(b => b.BookKeywords) //  Ensure Keywords are loaded
        //                .ThenInclude(bk => bk.Keyword)
        //            .FirstOrDefaultAsync(b => b.Id == bookId);

        //        if (book == null)
        //        {
        //            response.Success = false;
        //            response.Message = "Book not found.";
        //            return response;
        //        }

        //        ////  Convert CoverImage to Base64 (if applicable)
        //        //string? coverImageUrl = null;
        //        //if (book.CoverImage != null && book.CoverImage.Length > 0)
        //        //{
        //        //    var base64Image = Convert.ToBase64String(book.CoverImage);
        //        //    coverImageUrl = $"data:image/jpeg;base64,{base64Image}";
        //        //}

        //        //  Convert Keywords from many-to-many relationship
        //        var keywordList = book.BookKeywords?.Select(bk => bk.Keyword.Name).ToList() ?? new List<string>();

        //        //  Create BookDTO
        //        var bookResponse = new BookDTO
        //        {
        //            Id = book.Id,
        //            Author = book.Author,
        //            ISBN = book.ISBN,
        //            Status = book.Status,
        //            Format = book.Format,
        //            Genre = book.Genre?.Name, //  Use Genre name instead of string
        //            Keywords = keywordList, //  Use list of keyword names
        //            PublisherName = book.Publisher?.UserName ?? "Unknown", //  Handle null Publisher
        //            Description = book.Description,
        //            Title = book.Title,
        //            PageCount = book.PageCount,
        //            IsAvailable = book.IsAvailable,
        //            PublicationDate = book.PublicationDate,
        //            State = book.State,
        //            Language = book.Language,
        //            //CoverImageUrl = coverImageUrl //  Include CoverImage URL
        //        };

        //        response.Success = true;
        //        response.Message = "Book retrieved successfully.";
        //        response.Data = bookResponse;
        //    }
        //    catch (Exception ex)
        //    {
        //        response.Success = false;
        //        response.Message = $"An error occurred: {ex.Message}";
        //    }

        //    return response;
        //}

        public async Task<ApiResponse<BookDTO>> GetBookByIdAsync(Guid bookId)
        {
            var response = new ApiResponse<BookDTO>();

            try
            {
                // Fetch the book with only necessary related data
                var bookData = await _context.Books
                    .Where(b => b.Id == bookId)
                    .Select(b => new
                    {
                        b.Id,
                        b.Title,
                        b.Author,
                        b.ISBN,
                        b.Status,
                        b.Format,
                        GenreName = b.Genre.Name,
                        PublisherName = b.Publisher.UserName,
                        Keywords = b.BookKeywords.Select(bk => bk.Keyword.Name).ToList(),
                        b.Description,
                        b.PageCount,
                        b.IsAvailable,
                        b.PublicationDate,
                        b.State,
                        b.Language
                    })
                    .FirstOrDefaultAsync();

                if (bookData == null)
                {
                    response.Success = false;
                    response.Message = "Book not found.";
                    return response;
                }

                //  Map fetched data to DTO
                var bookResponse = new BookDTO
                {
                    Id = bookData.Id,
                    Title = bookData.Title,
                    Author = bookData.Author,
                    ISBN = bookData.ISBN,
                    Status = bookData.Status,
                    Format = bookData.Format,
                    Genre = bookData.GenreName,
                    Keywords = bookData.Keywords,
                    PublisherName = bookData.PublisherName ?? "Unknown",
                    Description = bookData.Description,
                    PageCount = bookData.PageCount,
                    IsAvailable = bookData.IsAvailable,
                    PublicationDate = bookData.PublicationDate,
                    State = bookData.State,
                    Language = bookData.Language
                };

                response.Success = true;
                response.Message = "Book retrieved successfully.";
                response.Data = bookResponse;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"An error occurred: {ex.Message}";
            }

            return response;
        }


        //public async Task<ApiResponse<string>> GetBookCoverImage(Guid bookId)
        //{
        //    var response = new ApiResponse<string>();
        //    string coverImageUrl = "";
        //    try
        //    {
        //        var coverImage = _context.Books.Where(u => u.Id == bookId).Select(u => u.CoverImage).First();

        //        if (coverImage != null && coverImage.Length > 0)
        //        {
        //            var base64Image = Convert.ToBase64String(coverImage);
        //            coverImageUrl = $"data:image/jpeg;base64,{base64Image}";
        //        }

        //        response.Success = true;
        //        response.Message = "Books retrieved successfully.";
        //        response.Data = coverImageUrl; // Assign the books to the Data property
        //    }
        //    catch (Exception ex)
        //    {
        //        response.Success = false;
        //        response.Message = $"An error occurred: {ex.Message}";
        //    }

        //    return response;
        //}

        public async Task<ApiResponse<byte[]>> GetBookCoverImage(Guid bookId)
        {
            var response = new ApiResponse<byte[]>();
            try
            {
                var coverImage = _context.Books
                    .Where(u => u.Id == bookId)
                    .Select(u => u.CoverImage)
                    .FirstOrDefault();

                if (coverImage != null && coverImage.Length > 0)
                {
                    response.Success = true;
                    response.Message = "Image retrieved successfully.";
                    response.Data = coverImage;
                }
                else
                {
                    response.Success = false;
                    response.Message = "Image not found.";
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"An error occurred: {ex.Message}";
            }

            return response;
        }

        public async Task<ApiResponse<PDFDTO>> GetBookPDF(Guid bookId)
        {
            var response = new ApiResponse<PDFDTO>();
            string pdf = "";
            try
            {
                var bookPdf = _context.Books.Where(u => u.Id == bookId).Select(u => new { u.PdfFile, u.PdfFileName }).First();

                if (bookPdf != null)
                {

                    response.Success = true;
                    response.Message = "Books retrieved successfully.";
                    response.Data = new PDFDTO { pdfFile = bookPdf.PdfFile, pdfFileName = bookPdf.PdfFileName }; // Assign the books to the Data property
                    return response;
                }

                response.Success = false;
                response.Message = "pdf retrieved successfully.";
                response.Data = null; // Assign the books to the Data property
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"An error occurred: {ex.Message}";
            }

            return response;
        }
        //public async Task<IEnumerable<Book>> GetBooksByGenreAsync(string genre)
        //{
        //    return await _context.Books
        //    .Where(b => b.Genre == genre && b.Status == ApprovalStatus.Approved).ToListAsync();
        //}

        public async Task<IEnumerable<Book>> GetBooksByGenreAsync(string genreName)
        {
            return await _context.Books
                .Include(b => b.Genre) //  Ensure Genre is included
                .Where(b => b.Genre.Name == genreName && b.Status == ApprovalStatus.Approved)
                .ToListAsync();
        }


        public async Task<ApiResponse<IEnumerable<Book>>> GetPublishedBooksAsync(string publisherId)
        {
            var response = new ApiResponse<IEnumerable<Book>>();

            try
            {
                // Fetch books with related entities
                var books = await _context.Books
                             .Where(b => b.PublisherId == publisherId && b.Status == ApprovalStatus.Approved).ToListAsync();

                // Wrap the result in ApiResponse
                response.Success = true;
                response.Message = "Books retrieved successfully.";
                response.Data = books; // Assign the books to the Data property
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"An error occurred: {ex.Message}";
            }

            return response;
        }

        public Task<IEnumerable<Book>> GetMySavedBooksAsync(Guid readerId)
        {
            throw new NotImplementedException();
        }

        public async Task<ApiResponse<IEnumerable<Book>>> GetPendingBooksAsync(string publisherId)
        {
            var response = new ApiResponse<IEnumerable<Book>>();

            try
            {
                // Fetch books with related entities
                var books = await _context.Books
                            .Where(b => b.PublisherId == publisherId && b.Status == ApprovalStatus.Pending).ToListAsync();

                // Wrap the result in ApiResponse
                response.Success = true;
                response.Message = "Books retrieved successfully.";
                response.Data = books; // Assign the books to the Data property
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"An error occurred: {ex.Message}";
            }

            return response;
        }

        public async Task<ApiResponse<IEnumerable<Book>>> GetRejectedBooksAsync(string publisherId)
        {
            var response = new ApiResponse<IEnumerable<Book>>();

            try
            {
                // Fetch books with related entities
                var books = await _context.Books
                            .Where(b => b.PublisherId == publisherId && b.Status == ApprovalStatus.Rejected).ToListAsync();

                // Wrap the result in ApiResponse
                response.Success = true;
                response.Message = "Books retrieved successfully.";
                response.Data = books; // Assign the books to the Data property
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"An error occurred: {ex.Message}";
            }

            return response;
        }

        public Task<ApiResponse<IEnumerable<Book>>> SearchBooksAsync(string keyword)
        {
            throw new NotImplementedException();
        }

        //public async Task<ApiResponse<Guid>> UpdateBookAsync(Guid id, BookCreateRequest updateRequest)
        //{
        //    var response = new ApiResponse<Guid>();

        //    try
        //    {
        //        // Retrieve the existing book from the database
        //        var existingBook = await _context.Books.FindAsync(id);
        //        if (existingBook == null)
        //        {
        //            response.Success = false;
        //            response.Message = "Book not found.";
        //            response.Data = id;
        //            return response;
        //        }

        //        // Check for significant changes
        //        bool isMajorEdit =
        //            updateRequest.Title != existingBook.Title ||
        //            updateRequest.Author != existingBook.Author ||
        //            updateRequest.ISBN != existingBook.ISBN;

        //        // Check each field for changes and update if necessary
        //        if (!string.Equals(existingBook.Title, updateRequest.Title, StringComparison.OrdinalIgnoreCase))
        //            existingBook.Title = updateRequest.Title;

        //        if (!string.Equals(existingBook.Author, updateRequest.Author, StringComparison.OrdinalIgnoreCase))
        //            existingBook.Author = updateRequest.Author;

        //        if (!string.Equals(existingBook.Genre, updateRequest.Genre, StringComparison.OrdinalIgnoreCase))
        //            existingBook.Genre = updateRequest.Genre;

        //        if (!string.Equals(existingBook.Description, updateRequest.Description, StringComparison.OrdinalIgnoreCase))
        //            existingBook.Description = updateRequest.Description;

        //        if (!string.Equals(existingBook.ISBN, updateRequest.ISBN, StringComparison.OrdinalIgnoreCase))
        //            existingBook.ISBN = updateRequest.ISBN;

        //        if (updateRequest.CoverImage != null && !updateRequest.CoverImage.SequenceEqual(existingBook.CoverImage ?? Array.Empty<byte>()))
        //            existingBook.CoverImage = updateRequest.CoverImage;

        //        //if (!string.Equals(existingBook.CoverImageUrl, updateRequest.CoverImageUrl, StringComparison.OrdinalIgnoreCase))
        //        //    existingBook.CoverImageUrl = updateRequest.CoverImageUrl;

        //        if (updateRequest.PublicationDate != existingBook.PublicationDate && updateRequest.PublicationDate != DateTime.MinValue)
        //            existingBook.PublicationDate = updateRequest.PublicationDate;

        //        if (updateRequest.PageCount > 0 && updateRequest.PageCount != existingBook.PageCount)
        //            existingBook.PageCount = updateRequest.PageCount;

        //        if (!string.Equals(existingBook.Language, updateRequest.Language, StringComparison.OrdinalIgnoreCase))
        //            existingBook.Language = updateRequest.Language;

        //        if (!string.Equals(existingBook.Format, updateRequest.Format, StringComparison.OrdinalIgnoreCase))
        //            existingBook.Format = updateRequest.Format;

        //        //if (!string.Equals(existingBook.Keywords, updateRequest.Keywords, StringComparison.OrdinalIgnoreCase))
        //        //    existingBook.Keywords = updateRequest.Keywords;

        //        if (updateRequest.IsAvailable != existingBook.IsAvailable)
        //            existingBook.IsAvailable = updateRequest.IsAvailable;

        //        //if (existingBook.PublisherId != updateRequest.PublisherId)
        //        //    existingBook.PublisherId = updateRequest.PublisherId;


        //        // If major edits, reset approval status
        //        if (isMajorEdit)
        //        {
        //            existingBook.Status = ApprovalStatus.Pending;
        //        }

        //        existingBook.State = State.Edited;

        //        // Save changes to the database
        //        _context.Books.Update(existingBook); // This ensures only modified fields are persisted
        //        await _context.SaveChangesAsync();

        //        response.Success = true;
        //        response.Message = "Book updated successfully. You need to wait the admin's approval";
        //        response.Data = existingBook.Id;
        //    }
        //    catch (Exception ex)
        //    {
        //        response.Success = false;
        //        response.Message = $"An error occurred: {ex.Message}";
        //    }

        //    return response;
        //}

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

        //public async Task<ApiResponse<IEnumerable<Review>>> GetReviewsForBookAsync(Guid bookId)
        //{
        //    var response = new ApiResponse<IEnumerable<Review>>();

        //    // Retrieve reviews for the given book
        //    var reviews = await _context.Reviews
        //        .Where(r => r.BookId == bookId)
        //        .Include(r => r.User)  // You can include user info if needed
        //        .ToListAsync();

        //    response.Success = true;
        //    response.Message = "Reviews fetched successfully.";
        //    response.Data = reviews;

        //    return response;
        //}

        public async Task<ApiResponse<IEnumerable<ReviewDTO>>> GetReviewsForBookAsync(Guid bookId)
        {
            var response = new ApiResponse<IEnumerable<ReviewDTO>>();

            var reviews = await _context.Reviews
                .Where(r => r.BookId == bookId)
                .Include(r => r.User)
            .ToListAsync();

            var reviewsDTOs = reviews.Select(review => new ReviewDTO
            {
                Id = review.Id,
                BookId = review.BookId,
                CreatedAt = review.CreatedAt,
                Rating = review.Rating,
                ReviewText = review.ReviewText,
                UserId = review.UserId,
                UserName = review.User.UserName!,

            }).ToList();


            response.Success = true;
            response.Message = "Reviews fetched successfully.";
            response.Data = reviewsDTOs;

            return response;
        }

        public async Task<ApiResponse<IEnumerable<Genre>>> GetGenresAsync()
        {
            var response = new ApiResponse<IEnumerable<Genre>>();

            try
            {
                var genres = await _context.Genres.ToListAsync();

                response.Success = true;
                response.Message = "Genres retrieved successfully.";
                response.Data = genres;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"An error occurred: {ex.Message}";
            }

            return response;
        }
        public async Task<ApiResponse<IEnumerable<Language>>> GetLanguagesAsync()
        {
            var response = new ApiResponse<IEnumerable<Language>>();

            try
            {
                var languages = await _context.Languages.ToListAsync();

                response.Success = true;
                response.Message = "Languages retrieved successfully.";
                response.Data = languages;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"An error occurred: {ex.Message}";
            }

            return response;
        }

        public async Task<ApiResponse<IEnumerable<Keyword>>> GetKeywordsAsync()
        {
            var response = new ApiResponse<IEnumerable<Keyword>>();

            try
            {
                var keywords = await _context.Keywords.ToListAsync();

                response.Success = true;
                response.Message = "Keywords retrieved successfully.";
                response.Data = keywords;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"An error occurred: {ex.Message}";
            }

            return response;
        }
        public async Task<ApiResponse<IEnumerable<BookDTO>>> FilterBooksAsync(BookFilterRequest filter)
        {
            var response = new ApiResponse<IEnumerable<BookDTO>>();

            try
            {
                var query = _context.Books
                    .Include(b => b.Genre)
                    .Include(b => b.BookKeywords)
                        .ThenInclude(bk => bk.Keyword)
                    .AsQueryable();

                query = query.Where(b => b.Status == ApprovalStatus.Approved && b.IsAvailable == true);

                if (!string.IsNullOrWhiteSpace(filter.Title))
                    query = query.Where(b => b.Title.ToLower().Contains(filter.Title.ToLower()));

                if (!string.IsNullOrWhiteSpace(filter.Author))
                    query = query.Where(b => b.Author.ToLower().Contains(filter.Author.ToLower()));

                if (filter.Genres != null && filter.Genres.Any())
                    query = query.Where(b => filter.Genres.Contains(b.Genre.Id));

                if (filter.Languages != null && filter.Languages.Any())
                    query = query.Where(b => filter.Languages.Contains(b.Language));

                if (filter.Keywords != null && filter.Keywords.Any())
                    query = query.Where(b => b.BookKeywords.Any(bk => filter.Keywords.Contains(bk.Keyword.Name)));

                var books = await query.Select(book => new BookDTO
                {
                    Id = book.Id,
                    Title = book.Title,
                    Author = book.Author,
                    Genre = book.Genre.Name ?? "Unknown",
                    Description = book.Description,
                    ISBN = book.ISBN,
                    PublicationDate = book.PublicationDate,
                    PageCount = book.PageCount,
                    Language = book.Language,
                    Keywords = book.BookKeywords.Select(bk => bk.Keyword.Name).ToList(),
                    IsAvailable = book.IsAvailable,
                    State = book.State,
                    Status = book.Status,
                    PublisherId = book.PublisherId,
                    PublisherName = book.Publisher.CompanyName ?? "Unknown"
                }).ToListAsync();

                response.Success = true;
                response.Message = "Books filtered successfully.";
                response.Data = books;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Error filtering books: {ex.Message}";
            }

            return response;
        }
    }
}
