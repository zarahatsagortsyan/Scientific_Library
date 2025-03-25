import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ReviewsPage.css";
import axios from "axios";
import { Review } from "../../Models/Review";

const ReaderReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Review;
    direction: "asc" | "desc";
  } | null>(null);
  const [expandedReviewId, setExpandedReviewId] = useState<string | null>(null);

  const navigate = useNavigate();

  const reviewsPerPage = 5;

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      const decodedToken: any = JSON.parse(atob(token.split(".")[1]));
      const userId =
        decodedToken[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];
      setUserId(userId);
    }
    const fetchUserReviews = async () => {
      setLoading(true);
      try {
        console.log(userId);
        const response = await axios.get(
          `http://localhost:8001/api/Reader/user-reviews/${userId}`
        );
        if (response.data.success) {
          setReviews(response.data.data);
          setFilteredReviews(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch reviews.");
        }
      } catch (err) {
        setError("Failed to retrieve data.");
        console.error("Error fetching user reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserReviews();
  }, [userId]);

  if (loading) {
    return <div>Loading reviews...</div>;
  }

  const handleReviewClick = (reviewId: string) => {
    setExpandedReviewId((prev) => (prev === reviewId ? null : reviewId));
  };
  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      const response = await axios.delete(
        `http://localhost:8001/api/Reader/delete-review/${reviewId}?userId=${userId}`
      );
      if (response.data.success) {
        const updatedReviews = reviews.filter(
          (review) => review.id !== reviewId
        );
        setReviews(updatedReviews);
        setFilteredReviews(updatedReviews);
        alert("Review deleted successfully.");
      } else {
        alert(response.data.message || "Failed to delete review.");
      }
    } catch (err) {
      console.error("Error deleting review:", err);
      alert("Failed to delete review.");
    }
  };

  const handleSeeBook = (bookId: string) => {
    navigate(`/book/${bookId}`);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = reviews.filter(
      (review) =>
        review.reviewText.toLowerCase().includes(term) ||
        (review.bookTitle && review.bookTitle.toLowerCase().includes(term))
    );
    setFilteredReviews(filtered);
    setCurrentPage(1);
  };

  const handleSort = (key: keyof Review) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sortedReviews = [...filteredReviews].sort((a, b) => {
      if (key === "createdAt") {
        return direction === "asc"
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (typeof a[key] === "string" && typeof b[key] === "string") {
        return direction === "asc"
          ? (a[key] as string).localeCompare(b[key] as string)
          : (b[key] as string).localeCompare(a[key] as string);
      } else {
        return direction === "asc"
          ? (a[key] as number) - (b[key] as number)
          : (b[key] as number) - (a[key] as number);
      }
    });

    setFilteredReviews(sortedReviews);
    setSortConfig({ key, direction });
  };

  const startIndex = (currentPage - 1) * reviewsPerPage;
  const paginatedReviews = filteredReviews.slice(
    startIndex,
    startIndex + reviewsPerPage
  );
  // const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  return (
    <div className="user-reviews-page">
      <h3>My Reviews</h3>

      <input
        type="text"
        placeholder="Search reviews or book names..."
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />

      {filteredReviews.length > 0 ? (
        <div className="reviews-table-container">
          <table className="reviews-table">
            <thead>
              <tr>
                {[
                  { label: "#", key: "index" },
                  { label: "Title", key: "bookTitle" },
                  { label: "Rating", key: "rating" },
                  { label: "Review Text", key: "reviewText" },
                  { label: "Created At", key: "createdAt" },
                  { label: "Actions", key: "actions" },
                ].map(({ label, key }) => (
                  <th
                    key={label}
                    onClick={() =>
                      key !== "actions" && handleSort(key as keyof Review)
                    }
                    className={key !== "actions" ? "sortable" : ""}
                  >
                    {label}
                    {sortConfig?.key === key &&
                      (sortConfig.direction === "asc" ? " 🔼" : " 🔽")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedReviews.map((review, index) => (
                <tr key={review.id}>
                  <td>{startIndex + index + 1}</td>
                  <td>{review.bookTitle || "Unknown Book"}</td>
                  <td>{review.rating} / 5</td>
                  <td
                    className="review-text"
                    onClick={() => handleReviewClick(review.id)}
                    title="Click to expand"
                  >
                    {expandedReviewId === review.id
                      ? review.reviewText
                      : review.reviewText.length > 50
                      ? review.reviewText.substring(0, 50) + "..."
                      : review.reviewText}
                  </td>
                  <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                  <td className="">
                    <button
                      className="see-book-button"
                      onClick={() => handleSeeBook(review.bookId)}
                    >
                      📖 See
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteReview(review.id)}
                    >
                      ❌ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No reviews found.</p>
      )}
    </div>
  );
};

export default ReaderReviewsPage;
