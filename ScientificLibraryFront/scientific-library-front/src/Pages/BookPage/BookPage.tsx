import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./BookPage.css";
import { Book } from "../../Models/Book";
import { mockBooks } from "../../Shared/MockData";

const BookPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);

  useEffect(() => {
    const foundBook = mockBooks.find((b) => b.Id === id);
    setBook(foundBook || null);
  }, [id]);

  if (!book) {
    return <div className="BookPage">Loading...</div>;
  }

  const handleDownload = () => {
    // Placeholder logic for download
    alert("Starting book download...");
  };

  return (
    <div className="BookPage">
      <div className="BookPage__Image">
        <img
          className="BookPage__CoverImage"
          src={book.CoverImageUrl || "https://via.placeholder.com/250"}
          alt={book.Title}
        />
      </div>
      <div className="BookPage__Details">
        <h1>{book.Title}</h1>
        <p>
          <strong>Author:</strong> {book.Author}
        </p>
        <p>
          <strong>Genre:</strong> {book.Genre}
        </p>
        <p>
          <strong>Language:</strong> {book.Language}
        </p>
        <p>
          <strong>Published:</strong>{" "}
          {new Date(book.PublicationDate).toDateString()}
        </p>
        <button className="BookPage__DownloadButton" onClick={handleDownload}>
          Download Book
        </button>
      </div>
      <div className="BookPage__Description">
        <h2>Description:</h2>
        <p>{book.Description}</p>
      </div>
      {/* Add reviews section here */}
    </div>
  );
};

export default BookPage;
