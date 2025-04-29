import React, { useEffect, useState } from "react";
import "./AdminBooks.css";
import BookDetails from "../../../Components/BookDetails/BookDetails";
import { downloadPdf, openPdf } from "../../../Utils/Pdf";
import { useNavigate } from "react-router-dom";
import { Book } from "../../../Models/Book";
import api from "../../../api/api";

const AdminApprovedBooksPage: React.FC = () => {
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

  const handleImageClick = (book: Book) => {
    navigate(`/book/${book.id}`, { state: { book } });
  };

  const handleCloseDetails = () => {
    setSelectedBookId(null);
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
        const response = await api.get(
          `${import.meta.env.VITE_API_URL}/Admin/books/approved`,
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
    <div className="admin_content">
      <h2>Approved</h2>
      <br></br>
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
              {/* <p className="card__author">👤 {book.author}</p> */}
              {/* <p className="card__genre">📖 {book.genre}</p> */}
              {/* <p className="card__status">{getStatusLabel(book.status)}</p> */}
              <button
                className="details-button"
                onClick={() => handleViewDetails(book.id)}
              >
                👁️ View Details
              </button>
              <button className="open-button" onClick={() => openPdf(book.id)}>
                Open
              </button>
              <button
                className="download-button"
                onClick={() => downloadPdf(book.id)}
              >
                📥 Download
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

export default AdminApprovedBooksPage;
