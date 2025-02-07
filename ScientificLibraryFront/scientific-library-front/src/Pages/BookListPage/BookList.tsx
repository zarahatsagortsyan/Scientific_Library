import React from "react";
import { useNavigate } from "react-router-dom";
import { mockBooks } from "../../Shared/MockData"; // Import the mock data
import "./BookList.css";

const BookListPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBookClick = (id: string) => {
    navigate(`/book/${id}`);
  };

  return (
    <div className="BookListPage">
      <h1>Book List</h1>
      <div className="BookList">
        {mockBooks.map((book) => (
          <div
            key={book.Id}
            className="BookItem"
            onClick={() => handleBookClick(book.Id)}
          >
            <img
              src={book.CoverImageUrl || "default-cover.jpg"}
              alt={book.Title}
              className="BookThumbnail"
            />
            <div className="BookDetails">
              <h2>{book.Title}</h2>
              <p>by {book.Author}</p>
              <p>Genre: {book.Genre}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookListPage;
