import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "./PublisherBooks.css";
import BookDetails from "../../Components/BookDetails/BookDetails";
import { downloadPdf, openPdf } from "../../Utils/Pdf";
import { Book } from "../../Models/Book";
import { toggleBookAvailability } from "../../Utils/BookAvailability";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

const MaterialCardGrid: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleViewDetails = (bookId: string) => {
    if (bookId) {
      setSelectedBookId(bookId);
    }
  };

  const handleCloseDetails = () => {
    setSelectedBookId(null);
  };

  const handleImageClick = (book: Book) => {
    navigate(`/book/${book.id}`); // Navigate without passing the state
  };

  const handleToggleAvailability = async (book: Book) => {
    const updatedBook = await toggleBookAvailability(book);
    if (updatedBook) {
      setBooks((prevBooks) =>
        prevBooks.map((b) =>
          b.id === updatedBook.id
            ? { ...b, isAvailable: updatedBook.isAvailable }
            : b
        )
      );
    }
  };

  useEffect(() => {
    const fetchBooks = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setError("Authentication required.");
        setLoading(false);
        return;
      }

      try {
        const decodedToken: any = jwtDecode(token);
        const userId =
          decodedToken[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ];
        const response = await api.get(
          `http://localhost:8001/api/Publisher/books/published?publisherId=${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 200 && response.data.success) {
          setBooks(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch materials.");
        }
      } catch (error) {
        console.error("Error fetching materials:", error);
        setError("Failed to retrieve data.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return <div className="loader">⏳ Loading materials...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="publisher_content">
      {/* <br></br> */}
      <h2>Published</h2>
      <div className="material-card-grid">
        {books.map((book) => (
          <div className="card" key={book.id}>
            <img
              src={`http://localhost:8001/api/book/cover/${book.id}`}
              alt={book.title}
              className="book-image"
              onClick={() => handleImageClick(book)}
              style={{ cursor: "pointer" }}
            />
            <div className="card__content">
              <h3 className="card__title">{book.title}</h3>
              <p className="card__author">👤 {book.author}</p>
              <p className="card__genre">📖 {book.genre}</p>
              <button
                className="Pdetails-button"
                onClick={() => handleViewDetails(book.id)}
              >
                👁️ View Details
              </button>
              <button className="Popen-button" onClick={() => openPdf(book.id)}>
                📥 Open PDF
              </button>
              <button
                className="Pdownload-button"
                onClick={() => downloadPdf(book.id)}
              >
                📥 Download PDF
              </button>
              <button
                className="Pavailability-button"
                onClick={() => handleToggleAvailability(book)}
              >
                {book.isAvailable ? "🔴 Make Unavailable" : "🟢 Make Available"}
              </button>
            </div>
          </div>
        ))}

        {selectedBookId && (
          <BookDetails bookId={selectedBookId} onClose={handleCloseDetails} />
        )}
      </div>
    </div>
  );
};

export default MaterialCardGrid;
