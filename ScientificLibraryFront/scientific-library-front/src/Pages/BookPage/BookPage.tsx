// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import "./BookPage.css";
// import { Book } from "../../Models/Book";
// import { mockBooks } from "../../Shared/MockData";
// import { jwtDecode } from "jwt-decode";

// // Function to get user roles from JWT
// const getUserRoles = (): string[] | null => {
//   const token = localStorage.getItem("jwtToken");
//   if (!token) return null;

//   try {
//     const decodedToken: any = jwtDecode(token);
//     let roles =
//       decodedToken[
//         "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
//       ];

//     return Array.isArray(roles) ? roles : roles ? [roles] : null;
//   } catch (error) {
//     console.error("Failed to decode JWT token", error);
//     return null;
//   }
// };

// const BookPage: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const [book, setBook] = useState<Book | null>(null);
//   const roles = getUserRoles(); // Get user roles

//   useEffect(() => {
//     const foundBook = mockBooks.find((b) => b.Id === id);
//     setBook(foundBook || null);
//   }, [id]);

//   if (!book) {
//     return <div className="BookPage">Loading...</div>;
//   }

//   const handleDownload = () => {
//     alert("Starting book download...");
//   };

//   const handleAddToReadingList = (status: string) => {
//     alert(`Added to ${status}`);
//     // Call API to update reading status
//   };

//   return (
//     <div className="BookPage">
//       <div className="BookPage__Image">
//         <img
//           className="BookPage__CoverImage"
//           src={book.CoverImageUrl || "https://via.placeholder.com/250"}
//           alt={book.Title}
//         />
//       </div>
//       <div className="BookPage__Details">
//         <h1>{book.Title}</h1>
//         <p>
//           <strong>Author:</strong> {book.Author}
//         </p>
//         <p>
//           <strong>Genre:</strong> {book.Genre}
//         </p>
//         <p>
//           <strong>Language:</strong> {book.Language}
//         </p>
//         <p>
//           <strong>Published:</strong>{" "}
//           {new Date(book.PublicationDate).toDateString()}
//         </p>
//         <button className="BookPage__DownloadButton" onClick={handleDownload}>
//           Download Book
//         </button>

//         {/* Show buttons only for Readers */}
//         {roles?.includes("Reader") && (
//           <div className="BookPage__ReaderActions">
//             <button onClick={() => handleAddToReadingList("To Read")}>
//               📖 To Read
//             </button>
//             <button onClick={() => handleAddToReadingList("Reading")}>
//               ⏳ Reading
//             </button>
//             <button onClick={() => handleAddToReadingList("Read")}>
//               ✅ Read
//             </button>
//           </div>
//         )}
//       </div>
//       <div className="BookPage__Description">
//         <h2>Description:</h2>
//         <p>{book.Description}</p>
//       </div>
//     </div>
//   );
// };

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { downloadPdf, openPdf } from "../../Utils/Pdf";
import { toggleBookAvailability } from "../../Utils/BookAvailability";
import "./BookPage.css";

interface Review {
  userId: string;
  bookId: string;
  reviewText: string;
  rating: number;
}

const BookPage: React.FC = () => {
  const location = useLocation();
  const { book } = location.state || {};
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      const decodedToken: any = JSON.parse(atob(token.split(".")[1]));
      const role =
        decodedToken[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];
      setUserRole(role);
    }

    const fetchReviews = async () => {
      try {
        const reviewsResponse = await fetch(
          `http://localhost:8001/api/Book/reviews/${book.id}`
        );
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData || []);
      } catch (error) {
        console.error("Failed to fetch book reviews", error);
      }
    };

    if (book?.id) {
      fetchReviews();
    }
  }, [book]);

  const handleToggleAvailability = async () => {
    if (book) {
      const updatedBook = await toggleBookAvailability(book);
      if (updatedBook) {
        book.isAvailable = updatedBook.isAvailable;
      }
    }
  };

  const handleSubmitReview = async () => {
    if (!newReview.trim() || userRole !== "Reader") return;
    const token = localStorage.getItem("jwtToken");
    const decodedToken: any = JSON.parse(atob(token?.split(".")[1] || ""));
    const userId =
      decodedToken[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ];

    try {
      const response = await fetch("http://localhost:8001/api/book/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          UserId: userId,
          BookId: book.id,
          ReviewText: newReview,
          Rating: rating,
        }),
      });

      if (response.ok) {
        const newReviewData = await response.json();
        setReviews((prev) => [...prev, newReviewData]);
        setNewReview("");
        setRating(5);
      }
    } catch (error) {
      console.error("Failed to submit review", error);
    }
  };

  if (!book) {
    return <div className="loader">Book details not available.</div>;
  }
  console.log(book);
  return (
    <div className="book-page">
      <h2>{book.title}</h2>
      <img
        src={book.coverImageUrl || "https://via.placeholder.com/200"}
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
        <button
          className="availability-button"
          onClick={handleToggleAvailability}
        >
          {book.isAvailable ? "🔴 Make Unavailable" : "🟢 Make Available"}
        </button>
      </div>

      <div className="reviews-section">
        <h3>Reviews</h3>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="review">
              <p>
                <strong>Rating:</strong> {review.rating}/5
              </p>
              <p>{review.reviewText}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}

        {userRole === "Reader" && (
          <div className="add-review">
            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              placeholder="Write your review here..."
              rows={4}
            />
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            <button
              onClick={handleSubmitReview}
              className="submit-review-button"
            >
              Submit Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookPage;
