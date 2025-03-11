import React, { useEffect, useState } from "react";
import axios from "axios";
import "./BookDetails.css";
import { Book } from "../../Models/Book";

interface BookDetailsProps {
  bookId: string;
  onClose: () => void;
}

const BookDetails: React.FC<BookDetailsProps> = ({ bookId, onClose }) => {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8001/api/Book/info/${bookId}`
        );
        if (response.status === 200) {
          setBook(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch book details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  if (loading) {
    return <div>Loading book details...</div>;
  }

  if (!book) {
    return <div>No details found for this book.</div>;
  }

  return (
    <div className="book-details">
      <button className="close-button" onClick={onClose}>
        ✖ Close
      </button>
      <div className="book-details-content">
        {/* <img
          src={book.coverImageUrl || "https://via.placeholder.com/200"}
          alt={book.title}
          className="book-details-image"
        /> */}
        <div className="book-details-info">
          <h2>{book.title}</h2>
          <p>
            <strong>📖 Author:</strong> {book.author}
          </p>
          <p>
            <strong>🏷️ Genre:</strong> {book.genre}
          </p>
          <p>
            <strong>🗂️ ISBN:</strong> {book.isbn}
          </p>
          <p>
            <strong>🗓️ Published Date:</strong>{" "}
            {new Date(book.publicationDate).toLocaleDateString()}
          </p>
          <p>
            <strong>🗂️ Pages:</strong> {book.pageCount}
          </p>
          <p>
            <strong>🌐 Language:</strong> {book.language}
          </p>
          <p>
            <strong>🔍 Keywords:</strong>{" "}
            {book.keywords && Array.isArray(book.keywords)
              ? book.keywords.join(", ")
              : "No keywords available"}
          </p>

          <p>
            <strong>✅ Availability:</strong>{" "}
            {book.isAvailable ? "Available" : "Not Available"}
          </p>
          <p>
            <strong>📝 Description:</strong> {book.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
