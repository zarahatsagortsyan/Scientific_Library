// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import api from "../../api/api";

// interface BookStatusManagerProps {
//   bookId: string;
//   userId: string;
// }

// type ReadingStatus = "ToRead" | "Reading" | "Read";

// const BookStatusManager: React.FC<BookStatusManagerProps> = ({
//   bookId,
//   userId,
// }) => {
//   const [readingStatus, setReadingStatus] = useState<ReadingStatus | null>(
//     null
//   );
//   const [error, setError] = useState("");

//   const apiUrl = import.meta.env.VITE_API_URL;

//   useEffect(() => {
//     const fetchReadingStatus = async () => {
//       try {
//         const response = await api.get(
//           `${apiUrl}/Reader/user-books/${userId}/${bookId}`
//         );
//         if (response.data.success) {
//           setReadingStatus(response.data.data);
//         } else {
//           setError(response.data.message || "Failed to fetch reading status.");
//         }
//       } catch (err) {
//         setError("Error fetching reading status.");
//       }
//     };

//     fetchReadingStatus();
//   }, [bookId, userId, apiUrl]);

//   const handleStatusChange = async (newStatus: ReadingStatus) => {
//     try {
//       const token = localStorage.getItem("jwtToken");
//       if (!token) {
//         setError("Authentication required.");
//         return;
//       }

//       const response = await api.post(
//         `${apiUrl}/Reader/user-books`,
//         {
//           bookId,
//           userId,
//           readingStatus: newStatus,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.success) {
//         setReadingStatus(newStatus);
//       } else {
//         setError(response.data.message || "Failed to update reading status.");
//       }
//     } catch (err) {
//       setError("Error updating reading status.");
//     }
//   };

//   return (
//     <div>
//       <h3>Reading Status: {readingStatus || "Not set"}</h3>
//       {error && <p className="error">{error}</p>}
//       <div>
//         {["ToRead", "Reading", "Read"].map((status) => (
//           <button
//             key={status}
//             onClick={() => handleStatusChange(status as ReadingStatus)}
//             disabled={status === readingStatus}
//             className="status-button"
//           >
//             {status}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default BookStatusManager;
import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../../api/api";
import "./BookStatusManager.css";

interface BookStatusManagerProps {
  bookId: string;
  userId: string;
}

type ReadingStatus = "ToRead" | "Reading" | "Read";

const BookStatusManager: React.FC<BookStatusManagerProps> = ({
  bookId,
  userId,
}) => {
  const [readingStatus, setReadingStatus] = useState<ReadingStatus | null>(
    null
  );
  const [error, setError] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchReadingStatus = async () => {
      try {
        const response = await api.get(
          `${apiUrl}/Reader/user-books/${userId}/${bookId}`
        );
        if (response.data.success) {
          setReadingStatus(response.data.data);
        } else {
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
      } else {
        setError(response.data.message || "Failed to update reading status.");
      }
    } catch (err) {
      setError("Error updating reading status.");
    }
  };

  return (
    <div className="book-status-manager">
      <h3>Reading Status: {readingStatus || "Not set"}</h3>
      {error && <p className="error">{error}</p>}
      <div className="button-container">
        {["ToRead", "Reading", "Read"].map((status) => (
          <button
            key={status}
            onClick={() => handleStatusChange(status as ReadingStatus)}
            disabled={status === readingStatus}
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
