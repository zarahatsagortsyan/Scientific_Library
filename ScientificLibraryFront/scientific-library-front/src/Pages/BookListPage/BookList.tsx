import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BookList.css";
import { Book } from "../../Models/Book";
import api from "../../api/api";

const BookListPage: React.FC = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get(
          "http://localhost:8001/api/Book/allBooks"
        );
        if (response.status === 200 && response.data.success) {
          const data = Array.isArray(response.data.data)
            ? response.data.data
            : [];
          setBooks(data);
        } else {
          setError(response.data.message || "Failed to fetch books");
        }
      } catch (error) {
        console.error("Error fetching books:", error);
        setError("Failed to load books");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleBookClick = (book: Book) => {
    navigate(`/book/${book.id}`, { state: { book } });
  };

  if (loading) return <div className="loader">Loading books...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="BookListPage">
      <h1>Publications</h1>
      <div className="BookList">
        {books.map((book) => (
          <div
            key={book.id}
            className="BookItem"
            onClick={() => handleBookClick(book)}
          >
            <img
              src={`http://localhost:8001/api/book/cover/${book.id}`}
              alt={book.title}
              className="book-image"
              loading="lazy"
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
