// // import { useEffect, useState } from "react";
// // import api from "../api/api";
// // import { Review } from "../Models/Review";

// // export const getBookReviews = (bookId:string) => {
// //     const [reviews, setReviews] = useState<Review[]>([]);
// //     const [loading, setLoading] = useState<boolean>(true);
// //     const [error, setError] = useState<string | null>(null);
  
// //     useEffect(() => {
// //       const fetchReviews = async () => {
// //         try {
// //           const response = await api.get(
// //             `${import.meta.env.VITE_API_URL}"/book/reviews/${bookId}`
// //           );
  
// //           if (response.data.success) {
// //             setReviews(response.data.data);
// //           } else {
// //             setError("Failed to fetch reviews.");
// //           }
// //         } catch (error) {
// //           console.error("Error fetching reviews:", error);
// //           setError("Error fetching reviews.");
// //         } finally {
// //           setLoading(false);
// //         }
// //       };
  
// //       fetchReviews();
// //     }, [bookId]);
  
// //     return { reviews, loading, error };
// //   };
// import { useState, useEffect } from "react";
// import { Review } from "../Models/Review";
// import api from "../api/api";

// export const useBookReviews = (bookId: string) => {
//   const [reviews, setReviews] = useState<Review[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!bookId) return;

//     const fetchReviews = async () => {
//       try {
//         const response = await api.get(
//           `${import.meta.env.VITE_API_URL}/book/reviews/${bookId}`
//         );

//         if (response.data.success) {
//           setReviews(response.data.data);
//         } else {
//           setError("Failed to fetch reviews.");
//         }
//       } catch (error) {
//         console.error("Error fetching reviews:", error);
//         setError("Error fetching reviews.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReviews();
//   }, [bookId]); // Add bookId as a dependency

//   return { reviews, loading, error };
// };