// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { mockBooks } from "../../Shared/MockData"; // Import the mock data
// import "./BookList.css";

// const BookListPage: React.FC = () => {
//   const navigate = useNavigate();

//   const handleBookClick = (id: string) => {
//     navigate(`/book/${id}`);
//   };

//   return (
//     <div className="BookListPage">
//       <h1>Book List</h1>
//       <div className="BookList">
//         {mockBooks.map((book) => (
//           <div
//             key={book.Id}
//             className="BookItem"
//             onClick={() => handleBookClick(book.Id)}
//           >
//             <img
//               src={book.CoverImageUrl || "default-cover.jpg"}
//               alt={book.Title}
//               className="BookThumbnail"
//             />
//             <div className="BookDetails">
//               <h2>{book.Title}</h2>
//               <p>by {book.Author}</p>
//               <p>Genre: {book.Genre}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./BookList.css";
import { Book } from "../../Models/Book";

// interface Book {
//   id: string;
//   title: string;
//   author: string;
//   genre: string;
//   coverImageUrl: string;
// }

const BookListPage: React.FC = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8001/api/Book/allBooks"
        );
        if (response.status === 200 && response.data.success) {
          const data = Array.isArray(response.data.data)
            ? response.data.data
            : [];
          setBooks(data);
        } else {
          setError(response.data.message || "Failed to fetch books");
        }
      } catch (error) {
        console.error("Error fetching books:", error);
        setError("Failed to load books");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleBookClick = (book: Book) => {
    navigate(`/book/${book.id}`, { state: { book } });
  };

  if (loading) return <div className="loader">Loading books...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="BookListPage">
      <h1>Book List</h1>
      <div className="BookList">
        {books.map((book) => (
          <div
            key={book.id}
            className="BookItem"
            onClick={() => handleBookClick(book)}
          >
            <img
              src={book.coverImageUrl || "https://via.placeholder.com/200"}
              alt={book.title}
              className="book-image"
              style={{ cursor: "pointer" }}
            />
            {/* <img
              src={book.coverImageUrl || "default-cover.jpg"}
              alt={book.title}
              className="BookThumbnail"
            /> */}
            <div className="BookDetails">
              <h2>{book.title}</h2>
              <p>by {book.author}</p>
              <p>Genre: {book.genre}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookListPage;
