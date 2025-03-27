import React, { useState } from "react";
import "./ReviewForm.css";
import { Rating } from "react-simple-star-rating";

interface ReviewFormProps {
  bookId: string;
  userId: string;
  refreshReviews: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  bookId,
  userId,
  refreshReviews,
}) => {
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5);

  const handleSubmit = async () => {
    if (!newReview.trim()) return;
    const token = localStorage.getItem("jwtToken");

    try {
      await fetch("http://localhost:8001/api/Reader/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          UserId: userId,
          BookId: bookId,
          ReviewText: newReview,
          Rating: rating,
        }),
      });
      refreshReviews();
      setNewReview("");
      setRating(5);
    } catch (error) {
      console.error("Failed to submit review", error);
    }
  };

  return (
    <div className="review-form">
      <div className="rating-stars">
        <Rating
          onClick={(rate) => setRating(rate)}
          initialValue={rating}
          size={30}
          transition
          fillColor="gold"
          emptyColor="gray"
        />
      </div>
      <textarea
        value={newReview}
        onChange={(e) => setNewReview(e.target.value)}
        placeholder="Write your review here..."
        rows={4}
      />
      <button onClick={handleSubmit} className="submit-review-button">
        Submit Review
      </button>
    </div>
  );
};

export default ReviewForm;
