// import { jwtDecode } from "jwt-decode";
// import { Book } from "../Models/Book";
// import { useState } from "react";
// import axios from "axios";

// const toggleAvailability = async (book: Book) => {

//   const [error, setError] = useState<string | null>(null);
//   const [books, setBooks] = useState<Book[]>([]);
//     const token = localStorage.getItem("jwtToken");
//     if (!token) {
//         setError("Authentication required.");
//         console.error("Error fetching materials:", error);
//         return;
//     }
  
//     try {
//         const decodedToken: any = jwtDecode(token);
//         const publisherId =
//         decodedToken[
//             "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
//         ];
//         const response = await axios.patch(
//             `http://localhost:8001/api/Publisher/books/availability`,
//             {
//                 PublisherId: publisherId,
//                 BookId: book.id,
//                 Abailability: !book.isAvailable,
//             },
//             { headers: { Authorization: `Bearer ${token}` } }
//             );
//             if (response.status === 200) {
//             setBooks((prevBooks) =>
//                 prevBooks.map((b) =>
//                 b.id === book.id ? { ...b, isAvailable: !b.isAvailable } : b
//                 )
//             );
//             }

//     } catch (error) {
//       console.error("Failed to toggle availability:", error);
//     }
//   };
// src/Utils/BookUtils.js
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Book } from "../Models/Book";

export const toggleBookAvailability = async (book:Book) => {
  try {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      throw new Error("Authentication required.");
    }

    const decodedToken: any = jwtDecode(token);
    const publisherId =  decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

    const response = await axios.patch(
      `http://localhost:8001/api/Publisher/books/availability`,
      {
        PublisherId: publisherId,
        BookId: book.id,
        Abailability: !book.isAvailable,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.status === 200) {
      return { ...book, isAvailable: !book.isAvailable };
    } else {
      console.error("Failed to toggle availability:", response.data);
      return null;
    }
  } catch (error) {
    console.error("Error toggling availability:", error);
    return null;
  }
};