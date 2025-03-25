using ScientificLibraryBack.Contextes;
using ScientificLibraryBack.Models.DB;
using ScientificLibraryBack.Services.UserService;
using Microsoft.EntityFrameworkCore;
using ScientificLibraryBack.DTO;
using Microsoft.AspNetCore.Identity;

namespace ScientificLibraryBack.Services.PublisherService
{
    public class PublisherService : IPublisherService
    {
        private readonly IUserService _userService;
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ExtendedIdentityUser> _userManager;
        public PublisherService(IUserService userService, ApplicationDbContext context, UserManager<ExtendedIdentityUser> userManager)
        {
            _userService = userService;
            _context = context;
            _userManager = userManager;
        }

        public async Task<ApiResponse<Book>> ChangeAvailability(BookChangeAvailabilityRequest bookChangeAvailability)
        {
            var response = new ApiResponse<Book>();

            try
            {
                // Retrieve the existing book from the database
                var existingBook = await _context.Books.FindAsync(bookChangeAvailability.BookId);
                if (existingBook == null)
                {
                    response.Success = false;
                    response.Message = "Book not found.";
                    response.Data = null;
                    return response;
                }

                if (existingBook.PublisherId != bookChangeAvailability.PublisherId)
                {
                    response.Success = false;
                    response.Message = "Permission denied";
                    response.Data = null;
                    return response;
                }


                if (bookChangeAvailability.Availability != existingBook.IsAvailable)
                    existingBook.IsAvailable = bookChangeAvailability.Availability;

                //if (existingBook.PublisherId != updateRequest.PublisherId)
                //    existingBook.PublisherId = updateRequest.PublisherId;


                existingBook.State = State.Edited;

                // Save changes to the database
                _context.Books.Update(existingBook); // This ensures only modified fields are persisted
                await _context.SaveChangesAsync();

                response.Success = true;
                response.Message = "Book updated successfully.";
                response.Data = existingBook;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"An error occurred: {ex.Message}";
            }

            return response;
        }
        public async Task<ApiResponse<Guid>> CreateBookAsync(BookCreateRequest bookRequest, IFormFile coverImage, IFormFile pdfFile)
        {
            var response = new ApiResponse<Guid>();

            try
            {

                // 1️⃣ Check if ISBN already exists
                bool isbnExists = await _context.Books.AnyAsync(b => b.ISBN == bookRequest.ISBN);
                if (isbnExists)
                {
                    return new ApiResponse<Guid>
                    {
                        Success = false,
                        Message = "A book with the same ISBN already exists."
                    };
                }

                // 2️⃣ Validate required fields
                if (string.IsNullOrWhiteSpace(bookRequest.Title) ||
                    string.IsNullOrWhiteSpace(bookRequest.Author) ||
                      bookRequest.GenreId == 0 ||
                    string.IsNullOrWhiteSpace(bookRequest.ISBN))
                {
                    return new ApiResponse<Guid>
                    {
                        Success = false,
                        Message = "Missing required fields: Title, Author, Genre, or ISBN."
                    };
                }

                // 3️⃣ Handle Cover Image
                byte[] coverImageBytes = null;
                if (coverImage != null)
                {
                    using var imageStream = new MemoryStream();
                    await coverImage.CopyToAsync(imageStream);
                    coverImageBytes = imageStream.ToArray();
                }

                // 4️⃣ Handle PDF File
                byte[] pdfFileBytes = null;
                if (pdfFile != null)
                {
                    using var pdfStream = new MemoryStream();
                    await pdfFile.CopyToAsync(pdfStream);
                    pdfFileBytes = pdfStream.ToArray();
                }

                // 5️⃣ Validate Keywords (Only Allow Predefined Ones)
                var existingKeywords = await _context.Keywords
                    .Where(k => bookRequest.Keywords.Contains(k.Name))
                    .ToListAsync();

                // If any keyword does not exist in the DB, reject the request
                if (existingKeywords.Count != bookRequest.Keywords.Count)
                {
                    return new ApiResponse<Guid>
                    {
                        Success = false,
                        Message = "Invalid keywords selected. Please choose from the available options."
                    };
                }

                // 6️⃣ Create and save the book
                var book = new Book
                {
                    Id = Guid.NewGuid(),
                    Title = bookRequest.Title,
                    Author = bookRequest.Author,
                    GenreId = bookRequest.GenreId, //  Assign GenreId
                    Description = bookRequest.Description,
                    ISBN = bookRequest.ISBN,
                    CoverImage = coverImageBytes,
                    PublicationDate = bookRequest.PublicationDate,
                    PageCount = bookRequest.PageCount,
                    Language = bookRequest.Language,
                    Format = bookRequest.Format,
                    IsAvailable = bookRequest.IsAvailable,
                    Status = ApprovalStatus.Pending,
                    State = State.New,
                    PublisherId = bookRequest.PublisherId,
                    PdfFile = pdfFileBytes,
                    PdfFileName = pdfFile.FileName
                };

                _context.Books.Add(book);
                await _context.SaveChangesAsync();

                // 7️⃣ Assign Keywords to the Book
                book.BookKeywords = existingKeywords
                    .Select(k => new BookKeyword { BookId = book.Id, KeywordId = k.Id })
                    .ToList();

                await _context.SaveChangesAsync();

                // 8️⃣ Return success response
                response.Success = true;
                response.Message = "Book created successfully.";
                response.Data = book.Id;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"An error occurred while creating the book: {ex.Message}";
            }

            return response;
        }

        public Task<ApiResponse<bool>> DeleteBookAsync(Guid bookId)
        {
            throw new NotImplementedException();
        }
        public async Task<ApiResponse<IEnumerable<BookDTO>>> GetPublishedBooksAsync(string publisherId)
        {
            var response = new ApiResponse<IEnumerable<BookDTO>>();

            try
            {
                // Fetch only necessary fields
                var books = await _context.Books
                    .Where(b => b.PublisherId == publisherId && b.Status == ApprovalStatus.Approved)
                    .Select(b => new
                    {
                        b.Id,
                        b.Author,
                        b.ISBN,
                        b.Status,
                        b.Format,
                        GenreName = b.Genre.Name, //  Fetch Genre Name
                        PublisherName = b.Publisher.UserName, //  Fetch Publisher Name
                        Keywords = b.BookKeywords.Select(bk => bk.Keyword.Name).ToList(), //  Fetch Keywords as List<string>
                        b.Description,
                        b.Title,
                        b.PageCount,
                        b.IsAvailable,
                        b.PublicationDate,
                        b.State,
                        b.Language
                    })
                    .ToListAsync();

                var bookDTOs = books.Select(book => new BookDTO
                {
                    Id = book.Id,
                    Author = book.Author,
                    ISBN = book.ISBN,
                    Status = book.Status,
                    Format = book.Format,
                    Genre = book.GenreName, //  Use Genre Name
                    Keywords = book.Keywords, //  Use List of Keywords
                    PublisherName = book.PublisherName, //  Use Publisher Name
                    Description = book.Description,
                    Title = book.Title,
                    PageCount = book.PageCount,
                    IsAvailable = book.IsAvailable,
                    PublicationDate = book.PublicationDate,
                    State = book.State,
                    Language = book.Language
                }).ToList();

                // Wrap the result in ApiResponse
                response.Success = true;
                response.Message = "Published books retrieved successfully.";
                response.Data = bookDTOs;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"An error occurred: {ex.Message}";
            }

            return response;
        }
        public async Task<ApiResponse<IEnumerable<BookDTO>>> GetNyAllBooksAsync(string publisherId)
        {
            var response = new ApiResponse<IEnumerable<BookDTO>>();

            try
            {
                // Fetch only necessary fields
                var books = await _context.Books
                    .Where(b => b.PublisherId == publisherId)
                    .Select(b => new
                    {
                        b.Id,
                        b.Author,
                        b.ISBN,
                        b.Status,
                        b.Format,
                        GenreName = b.Genre.Name, //  Fetch Genre Name
                        PublisherName = b.Publisher.UserName, //  Fetch Publisher Name
                        Keywords = b.BookKeywords.Select(bk => bk.Keyword.Name).ToList(), //  Fetch Keywords as List<string>
                        b.Description,
                        b.Title,
                        b.PageCount,
                        b.IsAvailable,
                        b.PublicationDate,
                        b.State,
                        b.Language
                    })
                    .ToListAsync();

                var bookDTOs = books.Select(book => new BookDTO
                {
                    Id = book.Id,
                    Author = book.Author,
                    ISBN = book.ISBN,
                    Status = book.Status,
                    Format = book.Format,
                    Genre = book.GenreName, //  Use Genre Name
                    Keywords = book.Keywords, //  Use List of Keywords
                    PublisherName = book.PublisherName, //  Use Publisher Name
                    Description = book.Description,
                    Title = book.Title,
                    PageCount = book.PageCount,
                    IsAvailable = book.IsAvailable,
                    PublicationDate = book.PublicationDate,
                    State = book.State,
                    Language = book.Language
                }).ToList();

                // Wrap the result in ApiResponse
                response.Success = true;
                response.Message = "All books retrieved successfully.";
                response.Data = bookDTOs;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"An error occurred: {ex.Message}";
            }

            return response;
        }
        public async Task<ApiResponse<IEnumerable<BookDTO>>> GetPendingBooksAsync(string publisherId)
        {
            var response = new ApiResponse<IEnumerable<BookDTO>>();

            try
            {
                var books = await _context.Books
                    .Where(b => b.PublisherId == publisherId && b.Status == ApprovalStatus.Pending)
                    .Include(b => b.Genre) //  Eager load Genre
                    .Include(b => b.Publisher) //  Eager load Publisher
                    .Include(b => b.BookKeywords) //  Eager load BookKeywords
                        .ThenInclude(bk => bk.Keyword) //  Ensure Keywords are loaded
                    .Select(book => new BookDTO
                    {
                        Id = book.Id,
                        Author = book.Author,
                        ISBN = book.ISBN,
                        Status = book.Status,
                        Format = book.Format,
                        Genre = book.Genre.Name, //  Get Genre name
                        Keywords = book.BookKeywords.Select(bk => bk.Keyword.Name).ToList(), //  Extract Keywords efficiently
                        PublisherName = book.Publisher.UserName, //  Get Publisher name
                        Description = book.Description,
                        Title = book.Title,
                        PageCount = book.PageCount,
                        IsAvailable = book.IsAvailable,
                        PublicationDate = book.PublicationDate,
                        State = book.State,
                        Language = book.Language,
                    })
                    .ToListAsync(); //  Query is fully executed in DB before hitting C#

                response.Success = true;
                response.Message = "Pending books retrieved successfully.";
                response.Data = books;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"An error occurred: {ex.Message}";
            }

            return response;
        }

        public async Task<ApiResponse<IEnumerable<BookDTO>>> GetRejectedBooksAsync(string publisherId)
        {
            var response = new ApiResponse<IEnumerable<BookDTO>>();

            try
            {
                var books = await _context.Books
                    .Where(b => b.PublisherId == publisherId && b.Status == ApprovalStatus.Rejected)
                    .Select(b => new
                    {
                        b.Id,
                        b.Author,
                        b.ISBN,
                        b.Status,
                        b.Format,
                        GenreName = b.Genre.Name,
                        PublisherName = b.Publisher.UserName,
                        Keywords = b.BookKeywords.Select(bk => bk.Keyword.Name).ToList(),
                        b.Description,
                        b.Title,
                        b.PageCount,
                        b.IsAvailable,
                        b.PublicationDate,
                        b.State,
                        b.Language
                    })
                    .ToListAsync();

                var bookDTOs = books.Select(book => new BookDTO
                {
                    Id = book.Id,
                    Author = book.Author,
                    ISBN = book.ISBN,
                    Status = book.Status,
                    Format = book.Format,
                    Genre = book.GenreName, //  Fetch Genre name
                    Keywords = book.Keywords, //  Fetch keyword names
                    PublisherName = book.PublisherName,
                    Description = book.Description,
                    Title = book.Title,
                    PageCount = book.PageCount,
                    IsAvailable = book.IsAvailable,
                    PublicationDate = book.PublicationDate,
                    State = book.State,
                    Language = book.Language,
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

        public async Task<ApiResponse<Guid>> UpdateBookAsync(Guid id, BookCreateRequest updateRequest)
        {
            var response = new ApiResponse<Guid>();

            try
            {
                // Retrieve the existing book from the database
                var existingBook = await _context.Books
                    .Include(b => b.Genre) //  Ensure Genre is loaded
                    .Include(b => b.BookKeywords) //  Ensure Keywords are loaded
                    .FirstOrDefaultAsync(b => b.Id == id);

                if (existingBook == null)
                {
                    response.Success = false;
                    response.Message = "Book not found.";
                    response.Data = id;
                    return response;
                }

                // Check for significant changes
                bool isMajorEdit =
                    updateRequest.Title != existingBook.Title ||
                    updateRequest.Author != existingBook.Author ||
                    updateRequest.ISBN != existingBook.ISBN ||
                    updateRequest.GenreId != existingBook.Genre?.Id; //  Check if Genre changed

                // Update fields if necessary
                if (!string.Equals(existingBook.Title, updateRequest.Title, StringComparison.OrdinalIgnoreCase))
                    existingBook.Title = updateRequest.Title;

                if (!string.Equals(existingBook.Author, updateRequest.Author, StringComparison.OrdinalIgnoreCase))
                    existingBook.Author = updateRequest.Author;

                if (existingBook.Genre?.Id != updateRequest.GenreId)
                    existingBook.GenreId = updateRequest.GenreId; //  Store GenreId instead of Genre name

                if (!string.Equals(existingBook.Description, updateRequest.Description, StringComparison.OrdinalIgnoreCase))
                    existingBook.Description = updateRequest.Description;

                if (!string.Equals(existingBook.ISBN, updateRequest.ISBN, StringComparison.OrdinalIgnoreCase))
                    existingBook.ISBN = updateRequest.ISBN;

                if (updateRequest.CoverImage != null && !updateRequest.CoverImage.SequenceEqual(existingBook.CoverImage ?? Array.Empty<byte>()))
                    existingBook.CoverImage = updateRequest.CoverImage;

                if (updateRequest.PublicationDate != existingBook.PublicationDate && updateRequest.PublicationDate != DateTime.MinValue)
                    existingBook.PublicationDate = updateRequest.PublicationDate;

                if (updateRequest.PageCount > 0 && updateRequest.PageCount != existingBook.PageCount)
                    existingBook.PageCount = updateRequest.PageCount;

                if (!string.Equals(existingBook.Language, updateRequest.Language, StringComparison.OrdinalIgnoreCase))
                    existingBook.Language = updateRequest.Language;

                if (!string.Equals(existingBook.Format, updateRequest.Format, StringComparison.OrdinalIgnoreCase))
                    existingBook.Format = updateRequest.Format;

                if (updateRequest.IsAvailable != existingBook.IsAvailable)
                    existingBook.IsAvailable = updateRequest.IsAvailable;

                //  Handle Keywords (Many-to-Many Relationship)
                var existingKeywords = await _context.Keywords
                    .Where(k => updateRequest.Keywords.Contains(k.Name))
                    .ToListAsync();

                existingBook.BookKeywords.Clear(); // Remove old keywords
                existingBook.BookKeywords = existingKeywords
                    .Select(k => new BookKeyword { BookId = existingBook.Id, KeywordId = k.Id })
                    .ToList();

                //  Reset approval status if major edits are made
                if (isMajorEdit)
                {
                    existingBook.Status = ApprovalStatus.Pending;
                }

                existingBook.State = State.Edited;

                // Save changes to the database
                _context.Books.Update(existingBook);
                await _context.SaveChangesAsync();

                response.Success = true;
                response.Message = "Book updated successfully. You need to wait for admin approval.";
                response.Data = existingBook.Id;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"An error occurred: {ex.Message}";
            }

            return response;
        }

        public async Task<ApiResponse<Book>> GetBookByIdAsync(Guid bookId)
        {
            var response = new ApiResponse<Book>();

            try
            {
                // Fetch books with related entities
                var books = await _context.Books
                            .Include(b => b.Publisher)
                            .Include(b => b.Reviews)  // Optionally include related entities like Reviews
                            .FirstOrDefaultAsync(b => b.Id == bookId);

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
        //  Get Publisher Profile
        public async Task<ApiResponse<PublisherProfileDTO>> GetPublisherProfileAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return new ApiResponse<PublisherProfileDTO> { Success = false, Message = "User not found" };

            var userProfile = new PublisherProfileDTO
            {
                CompanyName = user.CompanyName,
                Email = user.Email,
                Phone = user.PhoneNumber
            };

            return new ApiResponse<PublisherProfileDTO> { Success = true, Data = userProfile };
        }

        //  Update Publisher Profile
        public async Task<ApiResponse<string>> UpdatePublisherProfileAsync(string userId, PublisherProfileDTO profile)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return new ApiResponse<string> { Success = false, Message = "User not found" };

            if (!string.IsNullOrEmpty(profile.CompanyName)) user.CompanyName = profile.CompanyName;
            if (!string.IsNullOrEmpty(profile.Phone)) user.PhoneNumber = profile.Phone;

            var result = await _userManager.UpdateAsync(user);

            return result.Succeeded
                ? new ApiResponse<string> { Success = true, Message = "Profile updated successfully" }
                : new ApiResponse<string> { Success = false, Message = "Failed to update profile" };
        }

    }
}
