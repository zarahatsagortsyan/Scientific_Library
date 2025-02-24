// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import { downloadPdf, openPdf } from "../../Utils/Pdf";
// import { toggleBookAvailability } from "../../Utils/BookAvailability";
// import "./BookPage.css";

// interface Review {
//   userId: string;
//   bookId: string;
//   reviewText: string;
//   rating: number;
// }

// const BookPage: React.FC = () => {
//   const location = useLocation();
//   const { book } = location.state || {};
//   const [reviews, setReviews] = useState<Review[]>([]);
//   const [newReview, setNewReview] = useState("");
//   const [rating, setRating] = useState<number>(5);
//   const [userRole, setUserRole] = useState<string | null>(null);

//   useEffect(() => {
//     const token = localStorage.getItem("jwtToken");
//     if (token) {
//       const decodedToken: any = JSON.parse(atob(token.split(".")[1]));
//       const role =
//         decodedToken[
//           "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
//         ];
//       setUserRole(role);
//     }

//     const fetchReviews = async () => {
//       try {
//         const reviewsResponse = await fetch(
//           `http://localhost:8001/api/Book/reviews/${book.id}`
//         );
//         const reviewsData = await reviewsResponse.json();
//         setReviews(reviewsData || []);
//       } catch (error) {
//         console.error("Failed to fetch book reviews", error);
//       }
//     };

//     if (book?.id) {
//       fetchReviews();
//     }
//   }, [book]);

//   const handleToggleAvailability = async () => {
//     if (book) {
//       const updatedBook = await toggleBookAvailability(book);
//       if (updatedBook) {
//         book.isAvailable = updatedBook.isAvailable;
//       }
//     }
//   };

//   const handleSubmitReview = async () => {
//     if (!newReview.trim() || userRole !== "Reader") return;
//     const token = localStorage.getItem("jwtToken");
//     const decodedToken: any = JSON.parse(atob(token?.split(".")[1] || ""));
//     const userId =
//       decodedToken[
//         "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
//       ];

//     try {
//       const response = await fetch("http://localhost:8001/api/book/reviews", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           UserId: userId,
//           BookId: book.id,
//           ReviewText: newReview,
//           Rating: rating,
//         }),
//       });

//       if (response.ok) {
//         const newReviewData = await response.json();
//         setReviews((prev) => [...prev, newReviewData]);
//         setNewReview("");
//         setRating(5);
//       }
//     } catch (error) {
//       console.error("Failed to submit review", error);
//     }
//   };

//   const handleApproveBook = async () => {
//     // Logic for approving the book
//     console.log("Book Approved");
//   };

//   const handleRejectBook = async () => {
//     // Logic for rejecting the book
//     console.log("Book Rejected");
//   };

//   if (!book) {
//     return <div className="loader">Book details not available.</div>;
//   }

//   return (
//     <div className="book-page">
//       <h2>{book.title}</h2>
//       <img
//         src={book.coverImageUrl || "https://via.placeholder.com/200"}
//         alt={book.title}
//         className="book-cover"
//       />
//       <p>
//         <strong>Author:</strong> {book.author}
//       </p>
//       <p>
//         <strong>Genre:</strong> {book.genre}
//       </p>
//       <p>
//         <strong>Description:</strong> {book.description}
//       </p>
//       <p>
//         <strong>Publication Date:</strong> {book.publicationDate}
//       </p>

//       <div className="button-group">
//         <button className="open-button" onClick={() => openPdf(book.id)}>
//           📖 Open PDF
//         </button>
//         <button
//           className="download-button"
//           onClick={() => downloadPdf(book.id)}
//         >
//           ⬇️ Download PDF
//         </button>
//         <button
//           className="availability-button"
//           onClick={handleToggleAvailability}
//         >
//           {book.isAvailable ? "🔴 Make Unavailable" : "🟢 Make Available"}
//         </button>
//       </div>

//       {/* Admin Controls (Approve / Reject buttons) */}
//       {userRole === "Admin" && (
//         <div className="approvereject">
//           <button className="approve-button" onClick={handleApproveBook}>
//             Approve
//           </button>
//           <button className="reject-button" onClick={handleRejectBook}>
//             Reject
//           </button>
//         </div>
//       )}

//       <div className="reviews-section">
//         <h3>Reviews</h3>
//         {reviews.length > 0 ? (
//           reviews.map((review, index) => (
//             <div key={index} className="review">
//               <p>
//                 <strong>Rating:</strong> {review.rating}/5
//               </p>
//               <p>{review.reviewText}</p>
//             </div>
//           ))
//         ) : (
//           <p>No reviews yet.</p>
//         )}

//         {userRole === "Reader" && (
//           <div className="add-review">
//             <textarea
//               value={newReview}
//               onChange={(e) => setNewReview(e.target.value)}
//               placeholder="Write your review here..."
//               rows={4}
//             />
//             <select
//               value={rating}
//               onChange={(e) => setRating(Number(e.target.value))}
//             >
//               {[1, 2, 3, 4, 5].map((num) => (
//                 <option key={num} value={num}>
//                   {num}
//                 </option>
//               ))}
//             </select>
//             <button
//               onClick={handleSubmitReview}
//               className="submit-review-button"
//             >
//               Submit Review
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BookPage;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // useParams to access the bookId in the URL
import { downloadPdf, openPdf } from "../../Utils/Pdf";
import { toggleBookAvailability } from "../../Utils/BookAvailability";
import "./BookPage.css";
import { handleBookApprove } from "../../Utils/ApproveRejectBook";
import { Book } from "../../Models/Book";

interface Review {
  userId: string;
  bookId: string;
  reviewText: string;
  rating: number;
}
// interface Book {
//   id: string;
//   title: string;
//   author: string;
//   genre: string;
//   description: string;
//   isbn: string;
//   coverImageUrl?: string;
//   publicationDate: string;
//   pageCount: number;
//   language: string;
//   format: string;
//   keywords: string;
//   isAvailable: boolean;
// }

const BookPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>(); // Get the book ID from the URL
  const [book, setBook] = useState<Book>(); // Book state to store book details
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

    // const fetchBookDetails = async () => {
    //   if (!bookId) return;
    //   try {
    //     const response = await fetch(
    //       `http://localhost:8001/api/book/info/${bookId}` // Use the bookId to fetch data
    //     );
    //     const bookData = await response.json();
    //     console.log(bookData);
    //     setBook(bookData); // Store the fetched book data
    //     console.log(book);
    //   } catch (error) {
    //     console.error("Failed to fetch book details", error);
    //   }
    // };
    const fetchBookDetails = async () => {
      if (!bookId) return;
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
      }
    };

    const fetchReviews = async () => {
      if (!bookId) return;
      try {
        const reviewsResponse = await fetch(
          `http://localhost:8001/api/book/reviews/${bookId}` // Use bookId to fetch reviews
        );
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData || []);
      } catch (error) {
        console.error("Failed to fetch book reviews", error);
      }
    };

    if (bookId) {
      fetchBookDetails();
      fetchReviews();
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
          BookId: book?.id,
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

  const handleApproveBook = async () => {
    // Logic for approving the book
    console.log("Book Approved");
  };

  const handleRejectBook = async () => {
    // Logic for rejecting the book
    console.log("Book Rejected");
  };

  if (!book) {
    return <div className="loader">Book details not available.</div>;
  }

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
        <strong>🔍 Keywords:</strong> {book.keywords}
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
        <button
          className="availability-button"
          onClick={handleToggleAvailability}
        >
          {book.isAvailable ? "🔴 Make Unavailable" : "🟢 Make Available"}
        </button>
      </div>

      {/* Admin Controls (Approve / Reject buttons) */}
      {userRole === "Admin" && (
        <div className="approvereject">
          <button
            className="approve-button"
            onClick={() => handleBookApprove(book.id)}
          >
            Approve
          </button>
          <button className="reject-button" onClick={handleRejectBook}>
            Reject
          </button>
        </div>
      )}

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
