import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./BookPage.css";
import { Book } from "../../Models/Book";
import { mockBooks } from "../../Shared/MockData";
import { jwtDecode } from "jwt-decode";

// Function to get user roles from JWT
const getUserRoles = (): string[] | null => {
  const token = localStorage.getItem("jwtToken");
  if (!token) return null;

  try {
    const decodedToken: any = jwtDecode(token);
    let roles =
      decodedToken[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ];

    return Array.isArray(roles) ? roles : roles ? [roles] : null;
  } catch (error) {
    console.error("Failed to decode JWT token", error);
    return null;
  }
};

const BookPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const roles = getUserRoles(); // Get user roles

  useEffect(() => {
    const foundBook = mockBooks.find((b) => b.Id === id);
    setBook(foundBook || null);
  }, [id]);

  if (!book) {
    return <div className="BookPage">Loading...</div>;
  }

  const handleDownload = () => {
    alert("Starting book download...");
  };

  const handleAddToReadingList = (status: string) => {
    alert(`Added to ${status}`);
    // Call API to update reading status
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

        {/* Show buttons only for Readers */}
        {roles?.includes("Reader") && (
          <div className="BookPage__ReaderActions">
            <button onClick={() => handleAddToReadingList("To Read")}>
              📖 To Read
            </button>
            <button onClick={() => handleAddToReadingList("Reading")}>
              ⏳ Reading
            </button>
            <button onClick={() => handleAddToReadingList("Read")}>
              ✅ Read
            </button>
          </div>
        )}
      </div>
      <div className="BookPage__Description">
        <h2>Description:</h2>
        <p>{book.Description}</p>
      </div>
    </div>
  );
};

export default BookPage;
