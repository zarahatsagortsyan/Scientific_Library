// // import React, { useEffect, useState } from "react";
// // import { useNavigate, useLocation } from "react-router-dom";
// // import { Book } from "../../Models/Book";
// // import api from "../../api/api";
// // import BookFilter from "../../Components/BookFilter/BookFilter";
// // import { useGenres } from "../../Utils/GenresOper";
// // import { useLanguages } from "../../Utils/GetLanguages";
// // import { useKeywords } from "../../Utils/KeywordOper";
// // import "./BookList.css";

// // const BookListPage: React.FC = () => {
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const { genres } = useGenres();
// //   const { languages } = useLanguages();
// //   const { keywords } = useKeywords();
// //   const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
// //   const [loading, setLoading] = useState<boolean>(true);
// //   const [error, setError] = useState<string | null>(null);

// //   const queryParams = new URLSearchParams(location.search);
// //   const initialFilters = {
// //     title: queryParams.get("title") || "",
// //     author: queryParams.get("author") || "",
// //     genres: queryParams.getAll("genres").map(Number) || [], // Convert to numbers
// //     languages: queryParams.getAll("languages") || [],
// //     keywords: queryParams.getAll("keywords") || [],
// //   };

// //   const [filters, setFilters] = useState(initialFilters);

// //   const fetchFilteredBooks = async (newFilters: typeof filters) => {
// //     setLoading(true);
// //     console.log("Sending filters to backend:", newFilters);

// //     try {
// //       const queryParams = new URLSearchParams();

// //       Object.entries(newFilters).forEach(([key, value]) => {
// //         if (Array.isArray(value) && value.length > 0) {
// //           value.forEach((v) => queryParams.append(key, v.toString())); //  Fix multiple values
// //         } else if (typeof value === "string" && value.trim() !== "") {
// //           queryParams.set(key, value);
// //         }
// //       });

// //       const response = await api.get(
// //         `${import.meta.env.VITE_API_URL}/Book/filter?${queryParams.toString()}`
// //       );
// //       setFilteredBooks(response.data.data);
// //     } catch (err) {
// //       console.error("Error fetching filtered books:", err);
// //       setError("Failed to apply filters");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchFilteredBooks(filters);
// //   }, []);

// //   const handleFilterBooks = (newFilters: typeof filters) => {
// //     setFilters(newFilters);
// //     fetchFilteredBooks(newFilters);

// //     const query = new URLSearchParams();
// //     Object.entries(newFilters).forEach(([key, value]) => {
// //       if (Array.isArray(value) && value.length > 0) {
// //         value.forEach((v) => query.append(key, v.toString())); //  Fix issue of multiple values
// //       } else if (typeof value === "string" && value.trim() !== "") {
// //         query.set(key, value);
// //       }
// //     });

// //     navigate({ search: query.toString() }, { replace: true });
// //   };

// //   if (loading) return <div className="loader">Loading books...</div>;
// //   if (error) return <div className="error">{error}</div>;

// //   return (
// //     <div className="BookListPage">
// //       {/* <h1>Publications</h1> */}
// //       <BookFilter
// //         filters={filters}
// //         onFilter={handleFilterBooks}
// //         genres={genres.map((g) => ({ id: Number(g.id), name: g.name }))} //  Fix genre id type
// //         keywords={keywords.map((k) => k.name)} //  Extract keyword names
// //         languages={languages.map((l) => l.name)} //  Extract language names
// //       />
// //       <div className="BookList">
// //         {filteredBooks.map((book) => (
// //           <div
// //             key={book.id}
// //             className="BookItem"
// //             onClick={() => navigate(`/book/${book.id}`)}
// //           >
// //             <img
// //               src={`${import.meta.env.VITE_API_URL}/book/cover/${book.id}`}
// //               alt={book.title}
// //               className="book-image"
// //             />
// //             <div className="BookDetails">
// //               <h2>{book.title}</h2>
// //               <p>by {book.author}</p>
// //               <p>Genre: {book.genre}</p>
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// // export default BookListPage;
// import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import api from "../../api/api";
// import "./BookList.css";
// import { useGenres } from "../../Utils/GenresOper";
// import { useLanguages } from "../../Utils/GetLanguages";
// import { useKeywords } from "../../Utils/KeywordOper";
// import BookFilter from "../../Components/BookFilter/BookFilter";
// import BookSortDropdown from "../../Components/BookFilter/BookSortDropdown";
// import Pagination from "../../Components/BookFilter/Pagination";
// import { Book } from "../../Models/Book";

// const pageSize = 10;

// const BookListPage: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const { genres } = useGenres();
//   const { languages } = useLanguages();
//   const { keywords } = useKeywords();

//   const queryParams = new URLSearchParams(location.search);

//   const initialFilters = {
//     title: queryParams.get("title") || "",
//     author: queryParams.get("author") || "",
//     genres: queryParams.getAll("genres").map(Number),
//     languages: queryParams.getAll("languages"),
//     keywords: queryParams.getAll("keywords"),
//     orderBy: queryParams.get("orderBy") || "DateCreated",
//     isDescending: queryParams.get("isDescending") !== "false", // default true
//     pageNumber: parseInt(queryParams.get("pageNumber") || "1"),
//   };

//   const [filters, setFilters] = useState(initialFilters);
//   const [books, setBooks] = useState<Book[]>([]);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchBooks = async (filtersToApply = filters) => {
//     setLoading(true);
//     const query = new URLSearchParams();

//     Object.entries(filtersToApply).forEach(([key, value]) => {
//       if (Array.isArray(value)) {
//         value.forEach((v) => query.append(key, v.toString()));
//       } else {
//         query.set(key, value.toString());
//       }
//     });

//     try {
//       const response = await api.get(
//         `${import.meta.env.VITE_API_URL}/Book/filter?${query.toString()}`
//       );
//       const result = response.data.data;

//       setBooks(result.items);
//       setTotalPages(result.totalPages);
//       navigate({ search: query.toString() }, { replace: true });
//     } catch (err) {
//       console.error("Failed to fetch books:", err);
//       setError("Could not load books.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBooks();
//   }, []);

//   const handleFilterChange = (newFilters: typeof filters) => {
//     const updated = { ...newFilters, pageNumber: 1 };
//     setFilters(updated);
//     fetchBooks(updated);
//   };

//   const handleSortChange = (orderBy: string) => {
//     const updated = { ...filters, orderBy, pageNumber: 1 };
//     setFilters(updated);
//     fetchBooks(updated);
//   };

//   const handlePageChange = (page: number) => {
//     const updated = { ...filters, pageNumber: page };
//     setFilters(updated);
//     fetchBooks(updated);
//   };

//   return (
//     <div className="BookListPage px-6 py-4">
//       <div className="flex justify-between items-center mb-4">
//         <BookFilter
//           filters={filters}
//           onFilter={handleFilterChange}
//           genres={genres.map((g) => ({ id: Number(g.id), name: g.name }))}
//           languages={languages.map((l) => l.name)}
//           keywords={keywords.map((k) => k.name)}
//         />
//         <BookSortDropdown
//           orderBy={filters.orderBy}
//           onChange={handleSortChange}
//         />
//       </div>

//       {loading ? (
//         <div className="loader">Loading books...</div>
//       ) : error ? (
//         <div className="error text-red-600">{error}</div>
//       ) : (
//         <>
//           <div className="BookList grid grid-cols-2 md:grid-cols-4 gap-4">
//             {books.map((book) => (
//               <div
//                 key={book.id}
//                 className="BookItem bg-white shadow-md p-2 rounded hover:shadow-lg cursor-pointer"
//                 onClick={() => navigate(`/book/${book.id}`)}
//               >
//                 <img
//                   src={`${import.meta.env.VITE_API_URL}/book/cover/${book.id}`}
//                   alt={book.title}
//                   className="w-full h-40 object-cover mb-2"
//                 />
//                 <div>
//                   <h2 className="font-semibold text-lg">{book.title}</h2>
//                   <p className="text-sm text-gray-600">by {book.author}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <Pagination
//             currentPage={filters.pageNumber}
//             totalPages={totalPages}
//             onPageChange={handlePageChange}
//           />
//         </>
//       )}
//     </div>
//   );
// };

// export default BookListPage;
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api/api";
import "./BookList.css";
import { useGenres } from "../../Utils/GenresOper";
import { useLanguages } from "../../Utils/GetLanguages";
import { useKeywords } from "../../Utils/KeywordOper";
import BookFilter from "../../Components/BookFilter/BookFilter";
import BookSortDropdown from "../../Components/BookFilter/BookSortDropdown";
import Pagination from "../../Components/BookFilter/Pagination";
import { Book } from "../../Models/Book";


const BookListPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { genres } = useGenres();
  const { languages } = useLanguages();
  const { keywords } = useKeywords();

  const queryParams = new URLSearchParams(location.search);

  const initialFilters = {
    title: queryParams.get("title") || "",
    author: queryParams.get("author") || "",
    genres: queryParams.getAll("genres").map(Number),
    languages: queryParams.getAll("languages"),
    keywords: queryParams.getAll("keywords"),
    orderBy: queryParams.get("orderBy") || "DatePublished",
    isDescending: queryParams.get("isDescending") !== "false",
    pageNumber: parseInt(queryParams.get("pageNumber") || "1"),
  };

  const [filters, setFilters] = useState(initialFilters);
  const [books, setBooks] = useState<Book[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = async (filtersToApply = filters) => {
    setLoading(true);
    const query = new URLSearchParams();

    Object.entries(filtersToApply).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => query.append(key, v.toString()));
      } else {
        query.set(key, value.toString());
      }
    });

    try {
      const response = await api.get(
        `${import.meta.env.VITE_API_URL}/Book/filter?${query.toString()}`
      );
      const result = response.data;

      if (!result.success) {
        setError(result.message || "Failed to fetch books.");
        setBooks([]);
        return;
      }

      const paged = result.data;
      setBooks(paged.items);
      setTotalPages(paged.totalPages);
      setError(null); // clear previous errors
      navigate({ search: query.toString() }, { replace: true });
    } catch (err) {
      console.error("Failed to fetch books:", err);
      setError("Could not load books.");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleFilterChange = (newFilters: typeof filters) => {
    const updated = { ...newFilters, pageNumber: 1 };
    setFilters(updated);
    fetchBooks(updated);
  };

  const handleSortChange = (orderBy: string) => {
    const updated = { ...filters, orderBy, pageNumber: 1 };
    setFilters(updated);
    fetchBooks(updated);
  };

  const handlePageChange = (page: number) => {
    const updated = { ...filters, pageNumber: page };
    setFilters(updated);
    fetchBooks(updated);
  };

  return (
    <div className="BookListPage px-6 py-4">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <BookFilter
          filters={filters}
          onFilter={handleFilterChange}
          genres={genres.map((g) => ({ id: Number(g.id), name: g.name }))}
          languages={languages.map((l) => l.name)}
          keywords={keywords.map((k) => k.name)}
        />
      </div>
  <BookSortDropdown
          orderBy={filters.orderBy}
          onChange={handleSortChange}
        />
      {loading ? (
        <div className="loader">Loading books...</div>
      ) : error ? (
        <div className="error text-red-600">{error}</div>
      ) : books.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">No books found.</div>
      ) : (
        <>
          <div className="BookList grid grid-cols-2 md:grid-cols-4 gap-4">
            {books.map((book) => (
              <div
                key={book.id}
                className="BookItem bg-white shadow-md p-2 rounded hover:shadow-lg cursor-pointer"
                onClick={() => navigate(`/book/${book.id}`)}
              >
                <img
                  src={`${import.meta.env.VITE_API_URL}/book/cover/${book.id}`}
                  alt={book.title}
                  className="w-full h-40 object-cover mb-2"
                />
                
                <div className="BookDetails">
                <h6 className="font-bold">{book.title}</h6>
                  <p className="text-sm text-gray-600">by {book.author}</p>
                </div>
              </div>
            ))}
          </div>
          <Pagination
            currentPage={filters.pageNumber}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default BookListPage;
