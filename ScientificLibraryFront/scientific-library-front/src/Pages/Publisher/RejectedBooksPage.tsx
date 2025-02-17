import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./PublisherBooks.css";

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  publicationDate: string;
  status: number; // Status as number from the DB
}

const RejectedBooksPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRejectedBooks = async () => {
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
          `http://localhost:8001/api/Publisher/books/rejected?publisherId=${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 200 && response.data.success) {
          setBooks(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch rejected books.");
        }
      } catch (error) {
        console.error("Error fetching rejected books:", error);
        setError("Failed to retrieve data.");
      } finally {
        setLoading(false);
      }
    };

    fetchRejectedBooks();
  }, []);

  // Helper to convert enum numbers to readable strings
  const getStatusLabel = (status: number): string => {
    switch (status) {
      case 0:
        return "🟡 Rejected";
      case 1:
        return "🟢 Approved";
      case 2:
        return "🔴 Rejected";
      default:
        return "❓ Unknown";
    }
  };

  if (loading) return <div>Loading rejected books...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="rejected-books-page">
      <h2>📖 Rejected Books</h2>
      {books.length === 0 ? (
        <p>No rejected books found.</p>
      ) : (
        <table className="rejected-books-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Genre</th>
              <th>Publication Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.genre}</td>
                <td>{new Date(book.publicationDate).toLocaleDateString()}</td>
                <td>{getStatusLabel(book.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RejectedBooksPage;
