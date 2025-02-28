// // export default ReaderReadingList;
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./ReaderBooks.css";
// import BookDetails from "../../Components/BookDetails/BookDetails";
// import { downloadPdf, openPdf } from "../../Utils/Pdf";
// import { jwtDecode } from "jwt-decode";
// import { Book } from "../../Models/Book";
// import { useNavigate } from "react-router-dom";

// export enum ReadingStatus {
//   ToRead = 0,
//   Reading = 1,
//   Read = 2,
// }

// // Define the UserBookDTO structure with embedded BookInfo
// interface UserBookDTO {
//   id: string;
//   bookId: string;
//   userId: string;
//   finishedDate?: string | null;
//   readingStatus: ReadingStatus;
//   bookInfo: Book;
// }

// const ReaderReadingList: React.FC = () => {
//   const navigate = useNavigate();
//   const [books, setBooks] = useState<UserBookDTO[]>([]); // Updated to UserBookDTO
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

//   const handleViewDetails = (bookId: string) => {
//     setSelectedBookId(bookId);
//   };

//   const handleCloseDetails = () => {
//     setSelectedBookId(null);
//   };

//   const handleBookClick = (book: Book) => {
//     navigate(`/book/${book.id}`, { state: { book } });
//   };

//   useEffect(() => {
//     const fetchBooks = async () => {
//       const token = localStorage.getItem("jwtToken");
//       if (!token) {
//         setError("Authentication required.");
//         setLoading(false);
//         return;
//       }

//       try {
//         const decodedToken: any = jwtDecode(token);
//         const userId =
//           decodedToken[
//             "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
//           ];

//         const response = await axios.get(
//           `http://localhost:8001/api/Reader/user-books/${userId}?status=${ReadingStatus.Reading}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         console.log(response.data);
//         if (response.status === 200 && response.data.success) {
//           setBooks(response.data.data); // Correctly set UserBookDTO data
//         } else {
//           setError(response.data.message || "Failed to fetch materials.");
//         }
//       } catch (error) {
//         console.error("Error fetching materials:", error);
//         setError("Failed to retrieve data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBooks();
//   }, []);

//   if (loading) return <div className="loader">⏳ Loading materials...</div>;
//   if (error) return <div className="error">{error}</div>;

//   return (
//     <div>
//       <h1>To Read List</h1>
//       <br />
//       <div className="material-card-grid">
//         {books.map((userBook) => (
//           <div
//             key={userBook.bookInfo.id}
//             // className="BookItem"
//             onClick={() => handleBookClick(userBook.bookInfo)}
//           >
//             <div className="card" key={userBook.id}>
//               <img
//                 src={`http://localhost:8001/api/book/cover/${userBook.bookInfo.id}`}
//                 alt={userBook.bookInfo.title}
//                 className="book-image"
//               />
//               <div className="card__content">
//                 <h3 className="card__title">{userBook.bookInfo.title}</h3>
//                 <p className="card__author">👤 {userBook.bookInfo.author}</p>
//                 <p className="card__genre">📖 {userBook.bookInfo.genre}</p>
//                 <button
//                   className="details-button"
//                   onClick={() => handleViewDetails(userBook.bookInfo.id)}
//                 >
//                   👁️ View Details
//                 </button>
//                 <button
//                   className="open-button"
//                   onClick={() => openPdf(userBook.bookInfo.id)}
//                 >
//                   📥 Open PDF
//                 </button>
//                 <button
//                   className="download-button"
//                   onClick={() => downloadPdf(userBook.bookInfo.id)}
//                 >
//                   📥 Download PDF
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}

//         {selectedBookId && (
//           <BookDetails bookId={selectedBookId} onClose={handleCloseDetails} />
//         )}
//       </div>
//     </div>
//   );
// };

// export default ReaderReadingList;
import React from "react";
import UserBooksList, {
  ReadingStatus,
} from "../../Components/UserBook/UserBooksList";

const ReaderReadList: React.FC = () => (
  <UserBooksList readingStatus={ReadingStatus.Read} title="Completed" />
);

export default ReaderReadList;
