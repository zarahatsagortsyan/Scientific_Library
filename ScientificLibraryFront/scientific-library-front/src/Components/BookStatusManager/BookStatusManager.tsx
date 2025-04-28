import React, { useEffect, useState } from "react";
import api from "../../api/api";
import "./BookStatusManager.css";
import { BookEvents } from "../../Utils/BookEvents";

interface BookStatusManagerProps {
  bookId: string;
  userId: string;
}

type ReadingStatus = "ToRead" | "Reading" | "Read" | "None";

const BookStatusManager: React.FC<BookStatusManagerProps> = ({
  bookId,
  userId,
}) => {
  const [readingStatus, setReadingStatus] = useState<ReadingStatus>("None");
  const [error, setError] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchReadingStatus = async () => {
      try {
        const response = await api.get(
          `${apiUrl}/Reader/user-books/${userId}/${bookId}`
        );
        if (response.data.success) {
          setReadingStatus(
            response.data.data ? (response.data.data as ReadingStatus) : "None"
          );
        } else {
          setReadingStatus("None");
          setError(response.data.message || "Failed to fetch reading status.");
        }
      } catch (err) {
        setError("Error fetching reading status.");
      }
    };

    fetchReadingStatus();
  }, [bookId, userId, apiUrl]);

  const handleStatusChange = async (newStatus: ReadingStatus) => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setError("Authentication required.");
        return;
      }

      if (newStatus === "None") {
        const responseDelete = await api.delete(`${apiUrl}/Reader/user-books`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: {
            bookId,
            userId,
          },
        });

        if (responseDelete.data.success) {
          setReadingStatus("None");
          BookEvents.notify(); // trigger sidebar refresh
        } else {
          setError(
            responseDelete.data.message || "Failed to update reading status."
          );
        }
      } else {
        const response = await api.post(
          `${apiUrl}/Reader/user-books`,
          {
            bookId,
            userId,
            readingStatus: newStatus,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
          setReadingStatus(newStatus);
          BookEvents.notify(); //  trigger refresh for Sidebar
        } else {
          setError(response.data.message || "Failed to update reading status.");
        }
      }
    } catch (err) {
      setError("Error updating reading status.");
    }
  };

  return (
    <div className="book-status-manager">
      <h3>Reading Status: {readingStatus || "None"}</h3>
      {error && <p className="error">{error}</p>}
      <div className="button-container">
        {["None", "ToRead", "Reading", "Read"].map((status) => (
          <button
            key={status}
            onClick={() => handleStatusChange(status as ReadingStatus)}
            disabled={status.toLowerCase() === readingStatus.toLowerCase()}
            className={`status-button ${status}`}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BookStatusManager;
