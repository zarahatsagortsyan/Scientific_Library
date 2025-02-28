import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Review } from "../Models/Review";

// export interface Review {
//   userId: string;
//   bookId: string;
//   reviewText: string;
//   rating: number;
// }

// interface Review {
//     id: string;
//     userId: string;
//     bookId: string;
//     reviewText: string;
//     rating: number;
//     createdAt: string;
//     userName: string;
//   }
export const useBookReviews = (bookId: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Define the fetchReviews function with useCallback for reusability
  const refreshReviews = useCallback(async () => {
    if (!bookId) return;
    setLoading(true);
    try {
      const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/book/reviews/${bookId}`
      );
      if (response.data.success) {
        setReviews(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch reviews.");
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("Failed to retrieve reviews.");
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    refreshReviews();
  }, [refreshReviews]);

  return { reviews, loading, error, refreshReviews };
};


//   export const handleSubmitReview = async (reviewText: string, rating: number, userRole:string,bookId: string,userId:string  ) => {
//      const {
//         refreshReviews,
//       } = useBookReviews(bookId || "");
//     if (!reviewText.trim() || userRole !== "Reader") return;
//     const token = localStorage.getItem("jwtToken");
//     try {
//       await fetch("http://localhost:8001/api/book/reviews", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           UserId: userId,
//           BookId: bookId,
//           ReviewText: reviewText,
//           Rating: rating,
//         }),
//       });
//       refreshReviews(); // Correctly call refreshReviews
//     } catch (error) {
//       console.error("Failed to submit review", error);
//     }
//   };