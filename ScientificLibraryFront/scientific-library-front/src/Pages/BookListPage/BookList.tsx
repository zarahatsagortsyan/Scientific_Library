import React, { useEffect, useRef, useState } from "react";
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
  const isMounted = useRef(true); // 🚨 track mount status

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
        if (isMounted.current) {
          setError(result.message || "Failed to fetch books.");
          setBooks([]);
        }
        return;
      }

      const paged = result.data;

      if (isMounted.current) {
        setBooks(paged.items);
        setTotalPages(paged.totalPages);
        setError(null);
        navigate({ search: query.toString() }, { replace: true });
      }
    } catch (err) {
      console.error("Failed to fetch books:", err);
      if (isMounted.current) {
        setError("Could not load books.");
        setBooks([]);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    isMounted.current = true;
    fetchBooks();

    return () => {
      isMounted.current = false; // ✅ prevent side effects after unmount
    };
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

      <BookSortDropdown orderBy={filters.orderBy} onChange={handleSortChange} />

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
