
// const Pagination = ({
//   currentPage,
//   totalPages,
//   onPageChange,
// }: {
//   currentPage: number;
//   totalPages: number;
//   onPageChange: (page: number) => void;
// }) => {
//   if (totalPages <= 1) return null;

//   return (
//     <div className="flex justify-center gap-2 mt-6">
//       {Array.from({ length: totalPages }, (_, i) => (
//         <button
//           key={i}
//           onClick={() => onPageChange(i + 1)}
//           className={`px-3 py-1 rounded ${
//             currentPage === i + 1
//               ? "bg-blue-500 text-white"
//               : "bg-gray-200 hover:bg-gray-300"
//           }`}
//         >
//           {i + 1}
//         </button>
//       ))}
//     </div>
//   );
// };

// export default Pagination;
import React from "react";
import "./Pagination.css";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination-container">
      <div className="pagination-buttons">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i + 1)}
            className={`pagination-button ${
              currentPage === i + 1 ? "active" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Pagination;
