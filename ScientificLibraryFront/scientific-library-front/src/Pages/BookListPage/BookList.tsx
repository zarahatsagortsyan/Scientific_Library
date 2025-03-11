// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./BookList.css";
// import { Book } from "../../Models/Book";
// import api from "../../api/api";

// const BookListPage: React.FC = () => {
//   const navigate = useNavigate();
//   const [books, setBooks] = useState<Book[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchBooks = async () => {
//       try {
//         const response = await api.get(
//           "http://localhost:8001/api/Book/allBooks"
//         );
//         if (response.status === 200 && response.data.success) {
//           const data = Array.isArray(response.data.data)
//             ? response.data.data
//             : [];
//           setBooks(data);
//         } else {
//           setError(response.data.message || "Failed to fetch books");
//         }
//       } catch (error) {
//         console.error("Error fetching books:", error);
//         setError("Failed to load books");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBooks();
//   }, []);

//   const handleBookClick = (book: Book) => {
//     navigate(`/book/${book.id}`, { state: { book } });
//   };

//   if (loading) return <div className="loader">Loading books...</div>;
//   if (error) return <div className="error">{error}</div>;

//   return (
//     <div className="BookListPage">
//       <h1>Publications</h1>
//       <div className="BookList">
//         {books.map((book) => (
//           <div
//             key={book.id}
//             className="BookItem"
//             onClick={() => handleBookClick(book)}
//           >
//             <img
//               src={`http://localhost:8001/api/book/cover/${book.id}`}
//               alt={book.title}
//               className="book-image"
//               loading="lazy"
//             />

//             <div className="BookDetails">
//               <h2>{book.title}</h2>
//               <p>by {book.author}</p>
//               <p>Genre: {book.genre}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default BookListPage;
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Book } from "../../Models/Book";
import api from "../../api/api";
import BookFilter from "../../Components/BookFilter/BookFilter";
import { useGenres } from "../../Utils/GenresOper";
import { useLanguages } from "../../Utils/GetLanguages";
import { useKeywords } from "../../Utils/KeywordOper";
import "./BookList.css";

const BookListPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { genres } = useGenres();
  const { languages } = useLanguages();
  const { keywords } = useKeywords();

  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Restore filters from URL query params
  const queryParams = new URLSearchParams(location.search);
  const initialFilters = {
    title: queryParams.get("title") || "",
    author: queryParams.get("author") || "",
    genres: queryParams.getAll("genres").map(Number) || [], // Convert to numbers
    languages: queryParams.getAll("languages") || [],
    keywords: queryParams.getAll("keywords") || [],
  };

  const [filters, setFilters] = useState(initialFilters);

  // ✅ Fetch all books initially
  const fetchAllBooks = async () => {
    try {
      const response = await api.get("http://localhost:8001/api/Book/allBooks");
      setAllBooks(response.data.data);
      setFilteredBooks(response.data.data); // Initially show all books
    } catch {
      setError("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  // // ✅ Fetch books with filters when filter changes
  // const fetchFilteredBooks = async (newFilters: typeof filters) => {
  //   setLoading(true);
  //   console.log(newFilters);
  //   try {
  //     const response = await api.get("http://localhost:8001/api/Book/filter", {
  //       params: newFilters,
  //     });
  //     setFilteredBooks(response.data.data);
  //   } catch {
  //     setError("Failed to apply filters");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // const fetchFilteredBooks = async (newFilters: typeof filters) => {
  //   setLoading(true);
  //   console.log("Sending filters to backend:", newFilters);

  //   try {
  //     const response = await api.get("http://localhost:8001/api/Book/filter", {
  //       params: {
  //         ...newFilters,
  //         genres: newFilters.genres.join(","), // ✅ Convert array to CSV
  //         languages: newFilters.languages.join(","), // ✅ Convert array to CSV
  //         keywords: newFilters.keywords.join(","), // ✅ Convert array to CSV
  //       },
  //     });

  //     setFilteredBooks(response.data.data);
  //   } catch (err) {
  //     console.error("Error fetching filtered books:", err);
  //     setError("Failed to apply filters");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchFilteredBooks = async (newFilters: typeof filters) => {
    setLoading(true);
    console.log("Sending filters to backend:", newFilters);

    try {
      const queryParams = new URLSearchParams();

      Object.entries(newFilters).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          queryParams.set(key, value.join(",")); // ✅ Convert arrays to CSV
        } else if (typeof value === "string" && value.trim() !== "") {
          queryParams.set(key, value);
        }
      });

      const response = await api.get(
        `http://localhost:8001/api/Book/filter?${queryParams.toString()}`
      );
      setFilteredBooks(response.data.data);
    } catch (err) {
      console.error("Error fetching filtered books:", err);
      setError("Failed to apply filters");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchFilteredBooks(filters);
  }, []);

  // // ✅ Apply filters when user submits filter form
  // const handleFilterBooks = (newFilters: typeof filters) => {
  //   setFilters(newFilters);
  //   fetchFilteredBooks(newFilters);

  //   // ✅ Save filters in the URL so they persist
  //   const query = new URLSearchParams();
  //   Object.entries(newFilters).forEach(([key, value]) => {
  //     if (Array.isArray(value)) {
  //       value.forEach((v) => query.append(key, v.toString()));
  //     } else {
  //       query.set(key, value);
  //     }
  //   });
  //   navigate({ search: query.toString() }, { replace: true });
  // };

  const handleFilterBooks = (newFilters: typeof filters) => {
    setFilters(newFilters);
    fetchFilteredBooks(newFilters);

    const query = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        value.forEach((v) => query.append(key, v.toString()));
      } else if (typeof value === "string" && value.trim() !== "") {
        query.set(key, value);
      }
    });

    navigate({ search: query.toString() }, { replace: true });
  };

  if (loading) return <div className="loader">Loading books...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="BookListPage">
      <h1>Publications</h1>
      <BookFilter
        filters={filters}
        onFilter={handleFilterBooks}
        genres={genres.map((g) => ({ id: Number(g.id), name: g.name }))} // ✅ Fix genre id type
        keywords={keywords.map((k) => k.name)} // ✅ Extract keyword names
        languages={languages.map((l) => l.name)} // ✅ Extract language names
      />
      <div className="BookList">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="BookItem"
            onClick={() => navigate(`/book/${book.id}`)}
          >
            <img
              src={`http://localhost:8001/api/book/cover/${book.id}`}
              alt={book.title}
              className="book-image"
            />
            <div className="BookDetails">
              <h2>{book.title}</h2>
              <p>by {book.author}</p>
              <p>Genre: {book.genre}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookListPage;
