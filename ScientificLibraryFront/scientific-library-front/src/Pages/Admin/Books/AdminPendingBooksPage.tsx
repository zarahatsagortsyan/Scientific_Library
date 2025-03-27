// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./AdminBooks.css";
// import BookDetails from "../../../Components/BookDetails/BookDetails";
// import { downloadPdf, openPdf } from "../../../Utils/Pdf";
// import { useNavigate } from "react-router-dom";
// import { Book } from "../../../Models/Book";
// import {
//   handleBookApprove,
//   handleBookReject,
// } from "../../../Utils/ApproveRejectBook";

// const AdminPendingPage: React.FC = () => {
//   const [books, setBooks] = useState<Book[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
//   const navigate = useNavigate();

//   const handleViewDetails = (bookId: string) => {
//     if (bookId) {
//       setSelectedBookId(bookId);
//     }
//   };

//   const handleImageClick = (book: Book) => {
//     navigate(`/book/${book.id}`, { state: { book } });
//   };

//   const handleCloseDetails = () => {
//     setSelectedBookId(null);
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
//         const response = await axios.get(
//           `http://localhost:8001/api/Admin/books/pending`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         if (response.status === 200 && response.data.success) {
//           setBooks(response.data.data);
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
//       <h1>Pending</h1>
//       <br></br>
//       <div className="material-card-grid">
//         {books.map((book) => (
//           <div className="card" key={book.id}>
//             <img
//               src={`http://localhost:8001/api/book/cover/${book.id}`}
//               alt={book.title}
//               className="book-image"
//               onClick={() => handleImageClick(book)}
//               style={{ cursor: "pointer" }}
//             />
//             <div className="card__content">
//               <h3 className="card__title">{book.title}</h3>
//               {/* <p className="card__author">👤 {book.author}</p> */}
//               {/* <p className="card__genre">📖 {book.genre}</p> */}
//               {/* <p className="card__status">{getStatusLabel(book.status)}</p> */}
//               <button
//                 className="details-button"
//                 onClick={() => handleViewDetails(book.id)}
//               >
//                 👁️ View Details
//               </button>
//               <button className="open-button" onClick={() => openPdf(book.id)}>
//                 Open
//               </button>
//               <button
//                 className="download-button"
//                 onClick={() => downloadPdf(book.id)}
//               >
//                 📥 Download
//               </button>

//               <div className="approvereject">
//                 <button
//                   className="reject-button"
//                   onClick={() => handleBookReject(book.id)}
//                 >
//                   Reject
//                 </button>
//                 <button
//                   className="approve-button"
//                   onClick={() => handleBookApprove(book.id)}
//                 >
//                   Approve
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

// export default AdminPendingPage;
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminBooks.css";
import BookDetails from "../../../Components/BookDetails/BookDetails";
import { downloadPdf, openPdf } from "../../../Utils/Pdf";
import { useNavigate } from "react-router-dom";
import { Book } from "../../../Models/Book";
import {
  handleBookApprove,
  handleBookReject,
} from "../../../Utils/ApproveRejectBook";

const AdminPendingPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleViewDetails = (bookId: string) => {
    if (bookId) setSelectedBookId(bookId);
  };

  const handleImageClick = (book: Book) => {
    navigate(`/book/${book.id}`, { state: { book } });
  };

  const handleCloseDetails = () => {
    setSelectedBookId(null);
  };

  useEffect(() => {
    const fetchBooks = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setError("Authentication required.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8001/api/Admin/books/pending`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 200 && response.data.success) {
          setBooks(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch materials.");
        }
      } catch (error) {
        console.error("Error fetching materials:", error);
        setError("Failed to retrieve data.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return <div className="loader">⏳ Loading materials...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin_content">
      <h2>Pending</h2>
      <br />
      <div className="material-card-grid">
        {books.map((book) => (
          <div className="card" key={book.id}>
            <img
              src={`http://localhost:8001/api/book/cover/${book.id}`}
              alt={book.title}
              className="book-image"
              onClick={() => handleImageClick(book)}
            />
            <div className="card__content">
              <h3 className="card__title">{book.title}</h3>

              <button
                className="button details-button"
                onClick={() => handleViewDetails(book.id)}
              >
                👁️ View Details
              </button>

              <button
                className="button open-button"
                onClick={() => openPdf(book.id)}
              >
                Open
              </button>

              <button
                className="button download-button"
                onClick={() => downloadPdf(book.id)}
              >
                📥 Download
              </button>

              {/* <div className="approvereject"> */}
                <button
                  className="button reject-button"
                  onClick={() => handleBookReject(book.id)}
                >
                  Reject
                </button>
                <button
                  className="button approve-button"
                  onClick={() => handleBookApprove(book.id)}
                >
                  Approve
                </button>
              </div>
            </div>
          // </div>
        ))}

        {selectedBookId && (
          <BookDetails bookId={selectedBookId} onClose={handleCloseDetails} />
        )}
      </div>
    </div>
  );
};

export default AdminPendingPage;
