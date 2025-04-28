using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Crypto;
using ScientificLibraryBack.Contextes;
using ScientificLibraryBack.DTO;
using ScientificLibraryBack.Models;
using ScientificLibraryBack.Models.DB;
using ScientificLibraryBack.Services.UserService;


using System.Net;
using static System.Reflection.Metadata.BlobBuilder;

namespace ScientificLibraryBack.Services.BookService
{
    public class BookService : IBookService
    {
        private readonly IUserService _userService;
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        public BookService(IUserService userService, ApplicationDbContext context, IMapper mapper)
        {
            _userService = userService;
            _context = context;
            _mapper = mapper;
        }

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

        //public async Task<ApiResponse<BookDTO>> GetBookByIdAsync(Guid bookId)
        //{
        //    var response = new ApiResponse<BookDTO>();

        //    try
        //    {
        //        // Fetch the book with only necessary related data
        //        var bookData = await _context.Books
        //            .Where(b => b.Id == bookId)
        //            .Select(b => new
        //            {
        //                b.Id,
        //                b.Title,
        //                b.Author,
        //                b.ISBN,
        //                b.Status,
        //                b.Format,
        //                GenreName = b.Genre.Name,
        //                PublisherName = b.Publisher.UserName,
        //                Keywords = b.BookKeywords.Select(bk => bk.Keyword.Name).ToList(),
        //                b.Description,
        //                b.PageCount,
        //                b.IsAvailable,
        //                b.PublicationDate,
        //                b.State,
        //                b.Language
        //            })
        //            .FirstOrDefaultAsync();

        //        if (bookData == null)
        //        {
        //            response.Success = false;
        //            response.Message = "Book not found.";
        //            return response;
        //        }

        //        //  Map fetched data to DTO
        //        var bookResponse = new BookDTO
        //        {
        //            Id = bookData.Id,
        //            Title = bookData.Title,
        //            Author = bookData.Author,
        //            ISBN = bookData.ISBN,
        //            Status = bookData.Status,
        //            Format = bookData.Format,
        //            Genre = bookData.GenreName,
        //            Keywords = bookData.Keywords,
        //            PublisherName = bookData.PublisherName ?? "Unknown",
        //            Description = bookData.Description,
        //            PageCount = bookData.PageCount,
        //            IsAvailable = bookData.IsAvailable,
        //            PublicationDate = bookData.PublicationDate,
        //            State = bookData.State,
        //            Language = bookData.Language
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
                // Fetch the book with only necessary related data, including average rating
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
                        b.Language,
                        AverageRating = b.Reviews.Any() ? b.Reviews.Average(r => r.Rating) : 0 
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
                    Language = bookData.Language,
                    AverageRating = bookData.AverageRating 
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

        public async Task<IEnumerable<Book>> GetBooksByGenreAsync(string genreName)
        {
            return await _context.Books
                .Include(b => b.Genre) //  Ensure Genre is included
                .Where(b => b.Genre.Name == genreName && b.Status == ApprovalStatus.Approved)
                .ToListAsync();
        }

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
        //public async Task<ApiResponse<IEnumerable<BookDTO>>> FilterBooksAsync(BookFilterRequest filter)
        //{
        //    var response = new ApiResponse<IEnumerable<BookDTO>>();

        //    try
        //    {
        //        var query = _context.Books
        //            .Include(b => b.Genre)
        //            .Include(b => b.BookKeywords)
        //                .ThenInclude(bk => bk.Keyword)
        //            .AsQueryable();

        //        query = query.Where(b => b.Status == ApprovalStatus.Approved && b.IsAvailable == true);

        //        if (!string.IsNullOrWhiteSpace(filter.Title))
        //            query = query.Where(b => b.Title.ToLower().Contains(filter.Title.ToLower()));

        //        if (!string.IsNullOrWhiteSpace(filter.Author))
        //            query = query.Where(b => b.Author.ToLower().Contains(filter.Author.ToLower()));

        //        if (filter.Genres != null && filter.Genres.Any())
        //            query = query.Where(b => filter.Genres.Contains(b.Genre.Id));

        //        if (filter.Languages != null && filter.Languages.Any())
        //            query = query.Where(b => filter.Languages.Contains(b.Language));

        //        if (filter.Keywords != null && filter.Keywords.Any())
        //            query = query.Where(b => b.BookKeywords.Any(bk => filter.Keywords.Contains(bk.Keyword.Name)));

        //        var books = await query.Select(book => new BookDTO
        //        {
        //            Id = book.Id,
        //            Title = book.Title,
        //            Author = book.Author,
        //            Genre = book.Genre.Name ?? "Unknown",
        //            Description = book.Description,
        //            ISBN = book.ISBN,
        //            PublicationDate = book.PublicationDate,
        //            PageCount = book.PageCount,
        //            Language = book.Language,
        //            Keywords = book.BookKeywords.Select(bk => bk.Keyword.Name).ToList(),
        //            IsAvailable = book.IsAvailable,
        //            State = book.State,
        //            Status = book.Status,
        //            PublisherId = book.PublisherId,
        //            PublisherName = book.Publisher.CompanyName ?? "Unknown"
        //        }).ToListAsync();

        //        response.Success = true;
        //        response.Message = "Books filtered successfully.";
        //        response.Data = books;
        //    }
        //    catch (Exception ex)
        //    {
        //        response.Success = false;
        //        response.Message = $"Error filtering books: {ex.Message}";
        //    }

        //    return response;
        //}

        //public async Task<ApiResponse<PagedResult<BookDTO>>> FilterBooksAsync(BookFilterRequest filter)
        //{
        //    var response = new ApiResponse<PagedResult<BookDTO>>();
        //    try
        //    {
        //        var booksQuery = _context.Books
        //            .Where(b => b.Status == ApprovalStatus.Approved && b.State != State.Deleted)
        //            .AsQueryable();

        //        if (!string.IsNullOrWhiteSpace(filter.Title))
        //            booksQuery = booksQuery.Where(b => b.Title.Contains(filter.Title));

        //        if (!string.IsNullOrWhiteSpace(filter.Author))
        //            booksQuery = booksQuery.Where(b => b.Author.Contains(filter.Author));

        //        if (filter.Genres != null && filter.Genres.Any())
        //            booksQuery = booksQuery.Where(b => filter.Genres.Contains(b.GenreId));

        //        if (filter.Languages != null && filter.Languages.Any())
        //            booksQuery = booksQuery.Where(b => filter.Languages.Contains(b.Language));

        //        if (filter.Keywords != null && filter.Keywords.Any())
        //        {
        //            booksQuery = booksQuery.Where(b =>
        //                b.BookKeywords.Any(bk => filter.Keywords.Contains(bk.Keyword.Name)));
        //        }

        //        var joinedQuery = from book in booksQuery
        //                          join reviewGroup in _context.Reviews
        //                              .GroupBy(r => r.BookId)
        //                              on book.Id equals reviewGroup.Key into reviewJoin
        //                          from reviewStats in reviewJoin.DefaultIfEmpty()
        //                          join userBookGroup in _context.UserBooks
        //                              .Where(ub => ub.ReadingStatus == ReadingStatus.Read)
        //                              .GroupBy(ub => ub.BookId)
        //                              on book.Id equals userBookGroup.Key into userBookJoin
        //                          from readStats in userBookJoin.DefaultIfEmpty()
        //                          select new
        //                          {
        //                              Book = book,
        //                              AvgRating = reviewStats != null ? reviewStats.Average(r => r.Rating) : 0,
        //                              ReadCount = readStats != null ? readStats.Count() : 0,
        //                              book.PublicationDate
        //                          };

        //        // Sorting
        //        joinedQuery = filter.OrderBy switch
        //        {
        //            BookOrderBy.Rating => filter.IsDescending
        //                ? joinedQuery.OrderByDescending(b => b.AvgRating)
        //                : joinedQuery.OrderBy(b => b.AvgRating),

        //            BookOrderBy.ReadCount => filter.IsDescending
        //                ? joinedQuery.OrderByDescending(b => b.ReadCount)
        //                : joinedQuery.OrderBy(b => b.ReadCount),

        //            BookOrderBy.DatePublished or _ => filter.IsDescending
        //                ? joinedQuery.OrderByDescending(b => b.PublicationDate)
        //                : joinedQuery.OrderBy(b => b.PublicationDate)
        //        };

        //        var totalCount = await joinedQuery.CountAsync();

        //        var pagedBooks = await joinedQuery
        //            .Skip((filter.PageNumber - 1) * filter.PageSize)
        //            .Take(filter.PageSize)
        //            .Select(x => x.Book)
        //            .ProjectTo<BookDTO>(_mapper.ConfigurationProvider)
        //            .ToListAsync();

        //        response.Success = true;
        //        response.Message = "Books filtered successfully.";
        //        response.Data = new PagedResult<BookDTO>
        //        {
        //            Items = pagedBooks,
        //            TotalCount = totalCount,
        //            PageNumber = filter.PageNumber,
        //            PageSize = filter.PageSize
        //        };
        //    }
        //    catch (Exception ex)
        //    {
        //        response.Success = false;
        //        response.Message = $"Error filtering books: {ex.Message}";
        //    }

        //    return response;
        //}

        public async Task<ApiResponse<PagedResult<BookDTO>>> FilterBooksAsync(BookFilterRequest filter)
        {
            var response = new ApiResponse<PagedResult<BookDTO>>();
            try
            {
                var baseQuery = _context.Books
                    .Where(b => b.Status == ApprovalStatus.Approved && b.State != State.Deleted && b.IsAvailable == true)
                    .AsQueryable();

                if (!string.IsNullOrWhiteSpace(filter.Title))
                    baseQuery = baseQuery.Where(b => b.Title.Contains(filter.Title));

                if (!string.IsNullOrWhiteSpace(filter.Author))
                    baseQuery = baseQuery.Where(b => b.Author.Contains(filter.Author));

                if (filter.Genres != null && filter.Genres.Any())
                    baseQuery = baseQuery.Where(b => filter.Genres.Contains(b.GenreId));

                if (filter.Languages != null && filter.Languages.Any())
                    baseQuery = baseQuery.Where(b => filter.Languages.Contains(b.Language));

                if (filter.Keywords != null && filter.Keywords.Any())
                {
                    baseQuery = baseQuery.Where(b =>
                        b.BookKeywords.Any(bk => filter.Keywords.Contains(bk.Keyword.Name)));
                }

                // Add subqueries for AvgRating and ReadCount (EF Core-friendly)
                var enrichedQuery = baseQuery.Select(b => new
                {
                    Book = b,
                    AvgRating = _context.Reviews
                        .Where(r => r.BookId == b.Id)
                        .Select(r => (double?)r.Rating)
                        .Average() ?? 0,

                    ReadCount = _context.UserBooks
                        .Where(ub => ub.BookId == b.Id && ub.ReadingStatus == ReadingStatus.Read)
                        .Count(),

                    b.PublicationDate
                });

                // Apply ordering
                enrichedQuery = filter.OrderBy switch
                {
                    BookOrderBy.Rating => filter.IsDescending
                        ? enrichedQuery.OrderByDescending(b => b.AvgRating)
                        : enrichedQuery.OrderBy(b => b.AvgRating),

                    BookOrderBy.ReadCount => filter.IsDescending
                        ? enrichedQuery.OrderByDescending(b => b.ReadCount)
                        : enrichedQuery.OrderBy(b => b.ReadCount),

                    BookOrderBy.DatePublished or _ => filter.IsDescending
                        ? enrichedQuery.OrderByDescending(b => b.PublicationDate)
                        : enrichedQuery.OrderBy(b => b.PublicationDate)
                };

                var totalCount = await enrichedQuery.CountAsync();

                var pagedBooks = await enrichedQuery
                    .Skip((filter.PageNumber - 1) * filter.PageSize)
                    .Take(filter.PageSize)
                    .Select(x => x.Book) // Only map the Book entity
                    .ProjectTo<BookDTO>(_mapper.ConfigurationProvider)
                    .ToListAsync();

                response.Success = true;
                response.Message = "Books filtered successfully.";
                response.Data = new PagedResult<BookDTO>
                {
                    Items = pagedBooks,
                    TotalCount = totalCount,
                    PageNumber = filter.PageNumber,
                    PageSize = filter.PageSize
                };
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
