import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // useParams to access the bookId in the URL
import { downloadPdf, openPdf } from "../../Utils/Pdf";
import { toggleBookAvailability } from "../../Utils/BookAvailability";
import "./BookPage.css";
import {
  handleBookApprove,
  handleBookReject,
} from "../../Utils/ApproveRejectBook";
import { Book } from "../../Models/Book";
import BookStatusManager from "../../Components/BookStatusManager/BookStatusManager";
import ReviewForm from "../../Components/Review/ReviewForm";
import ReviewList from "../../Components/Review/ReviewList";
import { useBookReviews } from "../../Utils/UseBookReviews";

const BookPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>(); // Get the book ID from the URL
  const [book, setBook] = useState<Book>(); // Book state to store book details
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state

  const {
    reviews,
    loading: loadingReviews,
    error,
    refreshReviews,
  } = useBookReviews(bookId || "");

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      const decodedToken: any = JSON.parse(atob(token.split(".")[1]));
      const role =
        decodedToken[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];
      const userId =
        decodedToken[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];
      setUserRole(role);
      setUserId(userId);
    }
    const fetchBookDetails = async () => {
      if (!bookId) return;
      setLoading(true); // Start loading
      try {
        const response = await fetch(
          `http://localhost:8001/api/book/info/${bookId}`
        );
        const bookData = await response.json();
        console.log("Fetched Book Data:", bookData); // Log the fetched data
        if (bookData.success) {
          setBook(bookData.data); // Store the book data in the state
        } else {
          console.error("Failed to retrieve book data:", bookData.message);
        }
      } catch (error) {
        console.error("Failed to fetch book details", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    if (bookId) {
      fetchBookDetails();
    }
  }, [bookId]);

  const handleToggleAvailability = async () => {
    if (book) {
      const updatedBook = await toggleBookAvailability(book);
      if (updatedBook) {
        setBook((prev: any) => ({
          ...prev,
          isAvailable: updatedBook.isAvailable,
        }));
      }
    }
  };

  if (loading) {
    return <div className="loader">⏳ Loading book details...</div>;
  }

  if (!book) {
    return <div className="loader">❌ Book details not available.</div>;
  }

  return (
    <div className="book-page">
      {userRole === "Reader" && (
        <BookStatusManager bookId={book.id} userId={userId ?? ""} />
      )}
      <h2>{book.title}</h2>
      <img
        src={`http://localhost:8001/api/book/cover/${book.id}`}
        alt={book.title}
        className="book-cover"
      />
      <p>
        <strong>Author:</strong> {book.author}
      </p>
      <p>
        <strong>Genre:</strong> {book.genre}
      </p>
      <p>
        <strong>Description:</strong> {book.description}
      </p>
      <p>
        <strong>Publication Date:</strong> {book.publicationDate}
      </p>
      <p>
        <strong>🗂️ Pages:</strong> {book.pageCount}
      </p>
      <p>
        <strong>🌐 Language:</strong> {book.language}
      </p>
      <p>
        <strong>📑 Format:</strong> {book.format}
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
      <div className="button-group">
        <button className="open-button" onClick={() => openPdf(book.id)}>
          📖 Open PDF
        </button>
        <button
          className="download-button"
          onClick={() => downloadPdf(book.id)}
        >
          ⬇️ Download PDF
        </button>
        {userRole === "Publisher" && (
          <button
            className="availability-button"
            onClick={handleToggleAvailability}
          >
            {book.isAvailable ? "🔴 Make Unavailable" : "🟢 Make Available"}
          </button>
        )}
      </div>
      {/* Admin Controls (Approve / Reject buttons) */}
      {userRole === "Admin" && book.status === "Pending" && (
        <div className="approvereject">
          <button
            className="approve-button"
            onClick={() => handleBookApprove(book.id)}
          >
            Approve
          </button>
          <button
            className="reject-button"
            onClick={() => handleBookReject(book.id)}
          >
            Reject
          </button>
        </div>
      )}
      {
        <div className="reviews-section">
          <h3>Reviews</h3>
          {error && <p className="error">{error}</p>}
          {!loadingReviews && reviews.length > 0 ? (
            <ReviewList reviews={reviews} />
          ) : (
            <p>No reviews yet.</p>
          )}

          {userRole === "Reader" && userId && bookId && (
            <ReviewForm
              bookId={bookId}
              userId={userId}
              refreshReviews={refreshReviews}
            />
          )}
        </div>
      }
    </div>
  );
};
export default BookPage;
