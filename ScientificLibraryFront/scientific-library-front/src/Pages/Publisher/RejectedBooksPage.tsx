// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";
// import "./PublisherBooks.css";

// interface Book {
//   id: string;
//   title: string;
//   author: string;
//   genre: string;
//   publicationDate: string;
//   status: number; // Status as number from the DB
// }

// const RejectedBooksPage: React.FC = () => {
//   const [books, setBooks] = useState<Book[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchRejectedBooks = async () => {
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
//           `http://localhost:8001/api/Publisher/books/rejected?publisherId=${userId}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         if (response.status === 200 && response.data.success) {
//           setBooks(response.data.data);
//         } else {
//           setError(response.data.message || "Failed to fetch rejected books.");
//         }
//       } catch (error) {
//         console.error("Error fetching rejected books:", error);
//         setError("Failed to retrieve data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRejectedBooks();
//   }, []);

//   // Helper to convert enum numbers to readable strings
//   const getStatusLabel = (status: number): string => {
//     switch (status) {
//       case 0:
//         return "🟡 Rejected";
//       case 1:
//         return "🟢 Approved";
//       case 2:
//         return "🔴 Rejected";
//       default:
//         return "❓ Unknown";
//     }
//   };

//   if (loading) return <div>Loading rejected books...</div>;
//   if (error) return <div className="error">{error}</div>;

//   return (
//     <div className="rejected-books-page">
//       <h2>📖 Rejected Books</h2>
//       {books.length === 0 ? (
//         <p>No rejected books found.</p>
//       ) : (
//         <table className="rejected-books-table">
//           <thead>
//             <tr>
//               <th>Title</th>
//               <th>Author</th>
//               <th>Genre</th>
//               <th>Publication Date</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {books.map((book) => (
//               <tr key={book.id}>
//                 <td>{book.title}</td>
//                 <td>{book.author}</td>
//                 <td>{book.genre}</td>
//                 <td>{new Date(book.publicationDate).toLocaleDateString()}</td>
//                 <td>{getStatusLabel(book.status)}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default RejectedBooksPage;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./PublisherBooks.css";
import BookDetails from "../../Components/BookDetails/BookDetails";
import { downloadPdf, openPdf } from "../../Utils/Pdf";
import { Book } from "../../Models/Book";
import { toggleBookAvailability } from "../../Utils/BookAvailability";
import { useNavigate } from "react-router-dom";
import { DiNancy } from "react-icons/di";

const RejuectedCardGrid: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleViewDetails = (bookId: string) => {
    if (bookId) {
      setSelectedBookId(bookId);
    }
  };

  const handleCloseDetails = () => {
    setSelectedBookId(null);
  };

  const handleImageClick = (book: Book) => {
    navigate(`/book/${book.id}`); // Navigate without passing the state
  };

  const handleToggleAvailability = async (book: Book) => {
    const updatedBook = await toggleBookAvailability(book);
    if (updatedBook) {
      setBooks((prevBooks) =>
        prevBooks.map((b) =>
          b.id === updatedBook.id
            ? { ...b, isAvailable: updatedBook.isAvailable }
            : b
        )
      );
    }
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
        const decodedToken: any = jwtDecode(token);
        const userId =
          decodedToken[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ];
        const response = await axios.get(
          `http://localhost:8001/api/Publisher/books/rejected?publisherId=${userId}`,
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
    <div>
      <h1>Rejected</h1>
      <br></br>

      <div className="material-card-grid">
        {books.map((book) => (
          <div className="card" key={book.id}>
            <img
              src={`http://localhost:8001/api/book/cover/${book.id}`}
              alt={book.title}
              className="book-image"
              onClick={() => handleImageClick(book)}
              style={{ cursor: "pointer" }}
            />
            <div className="card__content">
              <h3 className="card__title">{book.title}</h3>
              <p className="card__author">👤 {book.author}</p>
              <p className="card__genre">📖 {book.genre}</p>
              <button
                className="details-button"
                onClick={() => handleViewDetails(book.id)}
              >
                👁️ View Details
              </button>
              <button className="open-button" onClick={() => openPdf(book.id)}>
                📥 Open PDF
              </button>
              <button
                className="download-button"
                onClick={() => downloadPdf(book.id)}
              >
                📥 Download PDF
              </button>
              <button
                className="availability-button"
                onClick={() => handleToggleAvailability(book)}
              >
                {book.isAvailable ? "🔴 Make Unavailable" : "🟢 Make Available"}
              </button>
            </div>
          </div>
        ))}

        {selectedBookId && (
          <BookDetails bookId={selectedBookId} onClose={handleCloseDetails} />
        )}
      </div>
    </div>
  );
};

export default RejuectedCardGrid;
