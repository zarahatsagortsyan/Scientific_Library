// // export default ReviewList;
// import React, { useState } from "react";
// import "./ReviewList.css";
// import { Rating } from "react-simple-star-rating";
// import { Review } from "../../Models/Review";

// interface ReviewListProps {
//   reviews: Review[];
// }

// const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const reviewsPerPage = 3;

//   const indexOfLastReview = currentPage * reviewsPerPage;
//   const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
//   const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

//   const totalPages = Math.ceil(reviews.length / reviewsPerPage);

//   const handlePageChange = (pageNumber: number) => {
//     setCurrentPage(pageNumber);
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   console.log(currentReviews);
//   return (
//     <div className="review-list">
//       {currentReviews.map((review) => (
//         <div key={review.id} className="review-card">
//           <div className="review-header">
//             <h4 className="review-username">{review.userName}</h4>
//             <span className="review-date">{formatDate(review.createdAt)}</span>
//           </div>
//           <div className="review-rating">
//             <Rating
//               readonly
//               initialValue={review.rating}
//               size={20}
//               fillColor="gold"
//               emptyColor="gray"
//             />
//             <span>{review.rating} / 5</span>
//           </div>
//           <p>{review.reviewText}</p>
//         </div>
//       ))}
//       <div className="pagination">
//         {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//           <button
//             key={page}
//             onClick={() => handlePageChange(page)}
//             className={`page-button ${currentPage === page ? "active" : ""}`}
//           >
//             {page}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ReviewList;
import React, { useState } from "react";
import "./ReviewList.css";
import { Rating } from "react-simple-star-rating";
import { Review } from "../../Models/Review";

interface ReviewListProps {
  reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const reviewsPerPage = 2;

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(event.target.value as "asc" | "desc");
    setCurrentPage(1); // Reset to the first page when sorting changes
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = sortedReviews.slice(
    indexOfFirstReview,
    indexOfLastReview
  );

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="review-list">
      <div className="sort-controls">
        <label htmlFor="sortOrder">Order by Date: </label>
        <select
          id="sortOrder"
          value={sortOrder}
          onChange={handleSortChange}
          className="sort-dropdown"
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      {currentReviews.map((review) => (
        <div key={review.id} className="review-card">
          <div className="review-header">
            <h4 className="review-username">{review.userName}</h4>
            <span className="review-date">{formatDate(review.createdAt)}</span>
          </div>
          <div className="review-rating">
            <Rating
              readonly
              initialValue={review.rating}
              size={20}
              fillColor="gold"
              emptyColor="gray"
            />
            <span>{review.rating} / 5</span>
          </div>
          <p>{review.reviewText}</p>
        </div>
      ))}

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`page-button ${currentPage === page ? "active" : ""}`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
