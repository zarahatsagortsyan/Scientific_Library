import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
// import "./MaterialCardGrid.css";
import "./PublisherBooks.css";
import BookDetails from "../../Components/BookDetails/BookDetails";

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  publicationDate: string;
  coverImageUrl: string;
  status: number;
}

const MaterialCardGrid: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  const handleViewDetails = (bookId: string) => {
    setSelectedBookId(bookId);
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
        const decodedToken: any = jwtDecode(token);
        const userId =
          decodedToken[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ];
        const response = await axios.get(
          `http://localhost:8001/api/Publisher/books/pending?publisherId=${userId}`,
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

  const getStatusLabel = (status: number): string => {
    const statusMap: Record<number, string> = {
      0: "🟡 Pending",
      1: "🟢 Approved",
      2: "🔴 Rejected",
    };
    return statusMap[status] || "❓ Unknown";
  };

  if (loading) return <div className="loader">⏳ Loading materials...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="material-card-grid">
      {books.map((book) => (
        <div className="card" key={book.id}>
          {/* <img
            src={book.coverImageUrl || "https://via.placeholder.com/200"}
            alt={book.title}
            className="card__image"
          /> */}
          <img
            src={book.coverImageUrl || "https://via.placeholder.com/200"}
            alt={book.title}
            className="book-image"
          />
          <div className="card__content">
            <h3 className="card__title">{book.title}</h3>
            <p className="card__author">👤 {book.author}</p>
            <p className="card__genre">📖 {book.genre}</p>
            <p className="card__status">{getStatusLabel(book.status)}</p>
            <button
              className="details-button"
              onClick={() => handleViewDetails(book.id)}
            >
              👁️ View Details
            </button>
          </div>
        </div>
      ))}

      {selectedBookId && (
        <BookDetails bookId={selectedBookId} onClose={handleCloseDetails} />
      )}
    </div>
  );
};

export default MaterialCardGrid;
