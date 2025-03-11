import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const queryParams = new URLSearchParams(location.search);
  const initialFilters = {
    title: queryParams.get("title") || "",
    author: queryParams.get("author") || "",
    genres: queryParams.getAll("genres").map(Number) || [], // Convert to numbers
    languages: queryParams.getAll("languages") || [],
    keywords: queryParams.getAll("keywords") || [],
  };

  const [filters, setFilters] = useState(initialFilters);

  const fetchFilteredBooks = async (newFilters: typeof filters) => {
    setLoading(true);
    console.log("Sending filters to backend:", newFilters);

    try {
      const queryParams = new URLSearchParams();

      Object.entries(newFilters).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          value.forEach((v) => queryParams.append(key, v.toString())); // ✅ Fix multiple values
        } else if (typeof value === "string" && value.trim() !== "") {
          queryParams.set(key, value);
        }
      });

      const response = await api.get(
        `${import.meta.env.VITE_API_URL}/Book/filter?${queryParams.toString()}`
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

  const handleFilterBooks = (newFilters: typeof filters) => {
    setFilters(newFilters);
    fetchFilteredBooks(newFilters);

    const query = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        value.forEach((v) => query.append(key, v.toString())); // ✅ Fix issue of multiple values
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
              src={`${import.meta.env.VITE_API_URL}/book/cover/${book.id}`}
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
