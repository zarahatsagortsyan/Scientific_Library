import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Review } from "../Models/Review";

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
