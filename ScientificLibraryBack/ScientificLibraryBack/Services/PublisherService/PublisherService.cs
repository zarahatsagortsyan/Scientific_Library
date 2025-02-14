using ScientificLibraryBack.Contextes;
using ScientificLibraryBack.Models.DB;
using ScientificLibraryBack.Services.UserService;
using Microsoft.EntityFrameworkCore;
using ScientificLibraryBack.DTO;

namespace ScientificLibraryBack.Services.PublisherService
{
    public class PublisherService:IPublisherService
    {
        private readonly IUserService _userService;
        private readonly ApplicationDbContext _context;
        public PublisherService(IUserService userService, ApplicationDbContext context)
        {
            _userService = userService;
            _context = context;
        }

        public async Task<ApiResponse<Book>> ChangeAvailability(BookChangeAvailabilityRequest bookChangeAvailability)
        {
            var response = new ApiResponse<Book>();

            try
            {
                // Retrieve the existing book from the database
                var existingBook = await _context.Books.FindAsync(bookChangeAvailability.PublisherId);
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
                

                if (bookChangeAvailability.Abailability != existingBook.IsAvailable)
                    existingBook.IsAvailable = bookChangeAvailability.Abailability;

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
                    string.IsNullOrWhiteSpace(bookRequest.Genre) ||
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

                // 5️⃣ Create and save the book
                var book = new Book
                {
                    Id = Guid.NewGuid(),
                    Title = bookRequest.Title,
                    Author = bookRequest.Author,
                    Genre = bookRequest.Genre,
                    Description = bookRequest.Description,
                    ISBN = bookRequest.ISBN,
                    CoverImage = coverImageBytes,
                    //CoverImageUrl = bookRequest.CoverImageUrl,
                    PublicationDate = bookRequest.PublicationDate,
                    PageCount = bookRequest.PageCount,
                    Language = bookRequest.Language,
                    Format = bookRequest.Format,
                    Keywords = bookRequest.Keywords,
                    IsAvailable = bookRequest.IsAvailable,
                    Status = ApprovalStatus.Pending,
                    State = State.New,
                    PublisherId = bookRequest.PublisherId,
                    PdfFile = pdfFileBytes, // Add PDF file bytes
                    PdfFileName = pdfFile.FileName
                };

                _context.Books.Add(book);
                await _context.SaveChangesAsync();

                // 6️⃣ Return success response
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

        //public async Task<ApiResponse<Guid>> CreateBookAsync(BookCreateRequest bookRequest)
        //{
        //    var response = new ApiResponse<Guid>(); // Change the type to Guid

        //    try
        //    {
        //        var findISBN = _context.Books.Where(b=>b.ISBN == bookRequest.ISBN);

        //        if (findISBN.Any())
        //        {
        //            response.Success = false;
        //            response.Message = "A material with same ISBN already exists.";
        //            return response;
        //        }

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
        //            CoverImageUrl = bookRequest.CoverImageUrl,
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

       
        //public async Task<IEnumerable<Book>> GetApprovedBooksAsync(Guid publisherId)
        //{
        //    return await _context.Books
        //            .Where(b => b.PublisherId == publisherId && b.Status == ApprovalStatus.Approved).ToListAsync();
        //}

      
        public async Task<ApiResponse<IEnumerable<Book>>> GetPublishedBooksAsync(string publisherId)
        {
            var response = new ApiResponse<IEnumerable<Book>>();

            try
            {
                // Fetch books with related entities
                var books = await _context.Books
                             .Where(b => b.PublisherId == publisherId && b.Status == ApprovalStatus.Approved).ToListAsync();

                // Convert CoverImage to Base64 directly
                foreach (var book in books)
                {
                    if (book.CoverImage != null && book.CoverImage.Length > 0)
                    {
                        var base64Image = Convert.ToBase64String(book.CoverImage);
                        book.CoverImageUrl = $"data:image/jpeg;base64,{base64Image}";
                    }
                }

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

        //public async Task<ApiResponse<IEnumerable<Book>>> GetPendingBooksAsync(string publisherId)
        //{
        //    var response = new ApiResponse<IEnumerable<Book>>();

        //    try
        //    {
        //        // Fetch books with related entities
        //        var books = await _context.Books
        //                    .Where(b => b.PublisherId == publisherId && b.Status == ApprovalStatus.Pending).ToListAsync();

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

        public async Task<ApiResponse<IEnumerable<Book>>> GetPendingBooksAsync(string publisherId)
        {
            var response = new ApiResponse<IEnumerable<Book>>();

            try
            {
                var books = await _context.Books
                    .Where(b => b.PublisherId == publisherId && b.Status == ApprovalStatus.Pending)
                    .Include(b => b.Publisher)
                    .Include(b => b.Reviews)
                    .ToListAsync();

                // Convert CoverImage to Base64 directly
                foreach (var book in books)
                {
                    if (book.CoverImage != null && book.CoverImage.Length > 0)
                    {
                        var base64Image = Convert.ToBase64String(book.CoverImage);
                        book.CoverImageUrl = $"data:image/jpeg;base64,{base64Image}";
                    }
                }

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


        public async Task<ApiResponse<IEnumerable<Book>>> GetRejectedBooksAsync(string publisherId)
        {
            var response = new ApiResponse<IEnumerable<Book>>();

            try
            {
                // Fetch books with related entities
                var books = await _context.Books
                            .Where(b => b.PublisherId == publisherId && b.Status == ApprovalStatus.Rejected).ToListAsync();

                // Convert CoverImage to Base64 directly
                foreach (var book in books)
                {
                    if (book.CoverImage != null && book.CoverImage.Length > 0)
                    {
                        var base64Image = Convert.ToBase64String(book.CoverImage);
                        book.CoverImageUrl = $"data:image/jpeg;base64,{base64Image}";
                    }
                }
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

        public async Task<ApiResponse<Guid>> UpdateBookAsync(Guid id, BookCreateRequest updateRequest)
        {
            var response = new ApiResponse<Guid>();

            try
            {
                // Retrieve the existing book from the database
                var existingBook = await _context.Books.FindAsync(id);
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
                    updateRequest.ISBN != existingBook.ISBN;

                // Check each field for changes and update if necessary
                if (!string.Equals(existingBook.Title, updateRequest.Title, StringComparison.OrdinalIgnoreCase))
                    existingBook.Title = updateRequest.Title;

                if (!string.Equals(existingBook.Author, updateRequest.Author, StringComparison.OrdinalIgnoreCase))
                    existingBook.Author = updateRequest.Author;

                if (!string.Equals(existingBook.Genre, updateRequest.Genre, StringComparison.OrdinalIgnoreCase))
                    existingBook.Genre = updateRequest.Genre;

                if (!string.Equals(existingBook.Description, updateRequest.Description, StringComparison.OrdinalIgnoreCase))
                    existingBook.Description = updateRequest.Description;

                if (!string.Equals(existingBook.ISBN, updateRequest.ISBN, StringComparison.OrdinalIgnoreCase))
                    existingBook.ISBN = updateRequest.ISBN;

                if (updateRequest.CoverImage != null && !updateRequest.CoverImage.SequenceEqual(existingBook.CoverImage ?? Array.Empty<byte>()))
                    existingBook.CoverImage = updateRequest.CoverImage;

                //if (!string.Equals(existingBook.CoverImageUrl, updateRequest.CoverImageUrl, StringComparison.OrdinalIgnoreCase))
                //    existingBook.CoverImageUrl = updateRequest.CoverImageUrl;

                if (updateRequest.PublicationDate != existingBook.PublicationDate && updateRequest.PublicationDate != DateTime.MinValue)
                    existingBook.PublicationDate = updateRequest.PublicationDate;

                if (updateRequest.PageCount > 0 && updateRequest.PageCount != existingBook.PageCount)
                    existingBook.PageCount = updateRequest.PageCount;

                if (!string.Equals(existingBook.Language, updateRequest.Language, StringComparison.OrdinalIgnoreCase))
                    existingBook.Language = updateRequest.Language;

                if (!string.Equals(existingBook.Format, updateRequest.Format, StringComparison.OrdinalIgnoreCase))
                    existingBook.Format = updateRequest.Format;

                if (!string.Equals(existingBook.Keywords, updateRequest.Keywords, StringComparison.OrdinalIgnoreCase))
                    existingBook.Keywords = updateRequest.Keywords;

                if (updateRequest.IsAvailable != existingBook.IsAvailable)
                    existingBook.IsAvailable = updateRequest.IsAvailable;

                //if (existingBook.PublisherId != updateRequest.PublisherId)
                //    existingBook.PublisherId = updateRequest.PublisherId;


                // If major edits, reset approval status
                if (isMajorEdit)
                {
                    existingBook.Status = ApprovalStatus.Pending;
                }

                existingBook.State = State.Edited;

                // Save changes to the database
                _context.Books.Update(existingBook); // This ensures only modified fields are persisted
                await _context.SaveChangesAsync();

                response.Success = true;
                response.Message = "Book updated successfully. You need to wait the admin's approval";
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
    }
}
